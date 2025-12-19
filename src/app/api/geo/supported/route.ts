import { NextResponse } from "next/server";
import { ERROR } from "@/app/types/errormessages";
import { sbHeader } from "@/app/types/rest";
import { db } from "@/app/utils/data/database";
import { supported_cities, supported_states } from "@/schemas/data";
import { eq, and } from "drizzle-orm";

type ListType = {
  code: string,
  name: string
}

type DetailType = {
  state: {
    code: string,
    name: string
  },
  city: string,
  name?: string,
  integrated: string,
  lat: string,
  lng: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type: string | null = searchParams.get('type');
  const state: string | null = searchParams.get('state');
  const city: string | null = searchParams.get('city');
    
  switch(type) {
    case "state":
      const stateList = await db.select().from(supported_states).where(eq(supported_states.avail, true));

      return NextResponse.json(stateList);
    case "city":
      if (state !== null) {
        const cityList = await db.select().from(supported_cities).where(and(eq(supported_cities.avail, true), eq(supported_cities.state, state)));
                
        return NextResponse.json(cityList);
      } else {
        return NextResponse.json({error: "존재하지 않는 지역입니다."}, {status: 404});
      }
                
    case "geo":
    case "single":
      if (city && state) {
        const data = await db.select().from(supported_cities)
          .leftJoin(supported_states, eq(supported_cities.state, supported_states.code))
          .where(and(and(eq(
            type === "geo" ? supported_cities.name : supported_cities.code, city
          ), eq(
            type === "geo" ? supported_states.name : supported_states.code, state
          )), eq(supported_cities.avail, true)));

        if (data.length > 0) {
          if (type === "geo") {
            return NextResponse.json({
              state: data[0].supported_states?.code,
              city: data[0].supported_cities?.code,
              lat: data[0].supported_cities.lat,
              lng: data[0].supported_cities.lng
            });
          } else {
            return NextResponse.json({
              state: data[0].supported_states,
              city: {
                code: data[0].supported_cities.code,
                name: data[0].supported_cities.name
              }
            })
          }
        }
      }
      
      return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
    case "current":
      const current: DetailType[] = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities?select=${
        `integrated, lat, lng&and=(state.eq.${state}, code.eq.${city})`
      }`, sbHeader).then((res) => res.json());

      if (current.length > 0) {
        return NextResponse.json({
          integrated: current[0].integrated,
          lat: current[0].lat,
          lng: current[0].lng
        })
      } else {
        return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
      }
    default:
      return NextResponse.json({error: ERROR.INVALIDATE_REGION}, {status: 400});
  }
}