"use server";

import { db } from "@/app/utils/data/database";
import { supported_cities, supported_states } from "@/schemas/data";
import { eq } from "drizzle-orm";
import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import Sqids from "sqids";

type SgisRegion = {
  addr_name: string;
  cd: string;
  full_addr: string;
  y_coor: string;
  x_coor: string;
};

// 캐시된 조회 함수
export const getStates = unstable_cache(
  async () => db.select().from(supported_states),
  ["current-states"],
  { tags: ["current-states"] }
);

export const getCities = unstable_cache(
  async (code: string) => db.select().from(supported_cities).where(eq(supported_cities.state, code)),
  ["current-cities"],
  { tags: ["current-cities"] }
);

async function getSgisToken() {
  const response = await fetch(
    `https://sgisapi.mods.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${process.env.SGIS_SERVICE_ID}&consumer_secret=${process.env.SGIS_SERVICE_SECRET}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return { success: false, error: "SGIS 인증 실패" };
  }

  const authData = await response.json();
  
  if (authData.errCd) {
    return { success: false, error: authData.errMsg };
  }

  const token = authData.result?.accessToken;
  if (!token) {
    return { success: false, error: "토큰 발급 실패" };
  }

  return token;
}

// 시/도 데이터 가져오기
export async function syncStatesFromSgis() {
  const authReq = await getSgisToken();
  
  if (authReq.success === false) {
    return authReq;
  }
  const token = authReq;

  const statesResponse = await fetch(
    `https://sgisapi.mods.go.kr/OpenAPI3/addr/stage.json?accessToken=${token}`,
    { cache: "no-store" }
  );

  const statesData = await statesResponse.json();
  
  if (!statesData.result?.length) {
    return { success: false, error: "시/도 데이터 없음" };
  }

  const hash = new Sqids({
    alphabet: process.env.HASH,
    minLength: 5,
  });

  await Promise.all(
    statesData.result.map(async (state: SgisRegion) => {
      const stateHash = hash.encode([Number(state.cd)]);
      await db
        .insert(supported_states)
        .values({
          name: state.addr_name,
          code: stateHash,
          avail: false,
        })
        .onConflictDoUpdate({
          target: supported_states.name,
          set: { code: stateHash },
        });
    })
  );

  updateTag("current-states");
  return { success: true };
}

// 시/군/구 데이터 가져오기
export async function syncCitiesFromSgis(sgisCd: string) {
  const hash = new Sqids({
    alphabet: process.env.HASH,
    minLength: 5,
  });
  const authReq = await getSgisToken();

  if (authReq.success === false) {
    return authReq;
  }
  const token = authReq;

  const response = await fetch(
    `https://sgisapi.mods.go.kr/OpenAPI3/addr/stage.json?accessToken=${token}&cd=${hash.decode(sgisCd)[0].toString()}`,
    { cache: "no-store" }
  );

  const data = await response.json();

  if (data.errCd || !data.result?.length) {
    return { success: false, error: data.errMsg ?? "시/군/구 데이터 조회 실패" };
  }

  await Promise.all(
    data.result.map(async (city: SgisRegion) => {
      const cityHash = hash.encode([Number(city.cd)]);
      const cityHallReq = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${city.addr_name}청`, {
        headers: {
          "Authorization": `KakaoAK ${process.env.KAKAO_REST_KEY}`
        }
      }).then((req) => req.json());

      let hall = null;
      if (cityHallReq.documents) {
        hall = cityHallReq.documents.find((place: {
          "place_name": string,
          "x": string,
          "y": string
        }) => place.place_name === `${city.addr_name}청` || place.place_name === `${city.addr_name.split(" ")[1]}청`);
      }

      await db
        .insert(supported_cities)
        .values({
          name: city.addr_name,
          code: cityHash,
          state: sgisCd,
          avail: false,
          lat: hall ? hall.y : null,
          lng: hall ? hall.x : null
        });
    })
  );

  updateTag("current-cities");
  return { success: true };
}

// 시/도 서비스 노출 토글
export async function toggleStateAvailability(code: string, currentAvail: boolean) {
  await db
    .update(supported_states)
    .set({ avail: !currentAvail })
    .where(eq(supported_states.code, code));

  updateTag("current-states");
  return { success: true, newAvail: !currentAvail };
}

export async function toggleCityAvailability(code: string, currentAvail: boolean) {
  await db
    .update(supported_cities)
    .set({ avail: !currentAvail })
    .where(eq(supported_cities.code, code));

  updateTag("current-cities");
  return { success: true, newAvail: !currentAvail };
}

export async function searchLocation(name: string) {
  const searchReq = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${name}`, {
    headers: {
      "Authorization": `KakaoAK ${process.env.KAKAO_REST_KEY}`
    }
  }).then((req) => req.json());

  if (searchReq && searchReq.documents) {
    return searchReq.documents
  }
}

export async function updateCityInfo(initalState: { success: boolean }, formData: FormData) {
  const form = {
    code: formData.get("code"),
    origin: formData.get("origin"),
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng"))
  }

  if (form.code) {
    const response = await db.update(supported_cities).set({
      origin: form.origin ? form.origin.toString() : null,
      lat: isNaN(form.lat) ? null : form.lat,
      lng: isNaN(form.lng) ? null : form.lng
    }).where(eq(supported_cities.code, form.code.toString()));

    updateTag("current-cities");
    return { success: true }
  }

  return { success: false, error: "해당하는 지역이 없습니다." }
}

