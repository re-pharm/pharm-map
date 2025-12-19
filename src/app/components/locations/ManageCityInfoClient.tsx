"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { City } from "./ManageCityClient"
import { faRefresh, faSave, faSearch } from "@fortawesome/free-solid-svg-icons"
import { use, useActionState, useEffect, useRef, useState } from "react"
import { searchLocation, updateCityInfo } from "@/app/admin/regions/actions";
import Kmap from "../kakaomap/Kmap";
import { useRouter } from "next/navigation";

type Props = {
  city: City,
  onSuccess?: () => void,
}

type Place = {
  place_name: string;
  address_name: string;
  road_address_name: string;
  place_url: string;
  x: string;
  y: string;
}

export default function ManageCityInfoClient(props: Props) {
  const router = useRouter();

  const keyword = useRef<HTMLInputElement>(null);
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);

  const [latLng, setLatLng] = useState<{lat: number, lng: number}>({lat: props.city.lat ?? 0, lng: props.city.lng ?? 0});
  const [searchResult, setSearchResult] = useState<Place[]>([]);

  const [state, formAction, pending] = useActionState(updateCityInfo, { success: false });

  useEffect(() => {
    if (latRef.current && lngRef.current && latLng) {
      latRef.current.value = latLng.lat.toString();
      lngRef.current.value = latLng.lng.toString();
    }

    if (keyword.current) {
      keyword.current.value = `${props.city.name}청`;
    }

    if (state && state.success) {
      if (props.onSuccess) {
        props.onSuccess();
      } else {
        router.refresh();
      }
    }
  }, [latLng, props.city.name, router, state, props.onSuccess, props]);  


  return(
    <form name="cityInfoForm" action={formAction} className="w-full">
      <div className="flex items-center justify-between mb-4 gap-2 w-full">
        <h4 className="text-xl">{props.city.name} 정보 관리</h4>
        <p className="flex gap-1 items-center">
          {state && state.success && !pending && (
            <span className="text-green-500 text-sm">저장되었습니다.</span>
          )}
          <button type="submit" className="plain-btn flex gap-1 items-center" disabled={pending}>
            {pending ? (<>
              <FontAwesomeIcon icon={faRefresh} spin />
              <span>저장 중...</span>
            </>) : (<>
              <FontAwesomeIcon icon={faSave} />
              <span>저장</span>
            </>)}
          </button>
        </p>
      </div>
      <section id="default-data">
        <label htmlFor="origin"></label>
        <input type="text" inputMode="text" placeholder="데이터 출처" name="origin" className="plain-input-form" />
        <input type="hidden" name="code" value={props.city.code} />
      </section>
      <section id="city-hall" className="my-4">
        <p className="text-lg">{props.city.name}청 위치</p>
        <span className="flex gap-2 mb-2">
          <input type="text" inputMode="text" placeholder="시청 검색"
            className="plain-input-form " defaultValue={`${props.city.name}청`} ref={keyword}
          />
          <button type="button" className="plain-btn" onClick={async (e) => {
            setSearchResult(await searchLocation(keyword.current?.value ?? ""));
            e.preventDefault();
          }} aria-label="검색">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </span>
        {searchResult.length > 0 ? (
          <ul className="max-h-48 overflow-y-scroll border border-gray-300 rounded-md p-2">
            {searchResult.map((place, index) => (
              <li key={index} className="mb-2">
                <p className="text-blue-600 hover:underline" onClick={(e) => setLatLng({ lat: Number(place.y), lng: Number(place.x)})}>
                  {place.place_name}
                </p>
                <p className="text-sm text-gray-600">
                  {place.road_address_name || place.address_name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        )}
        <div className="h-96">
          <Kmap latLng={latLng} />
        </div>
      </section>
      <section id="city-latlng" className="my-4">
        <span className="flex gap-2 items-center">
          <label htmlFor="lat">위도</label>
          <input type="text" inputMode="text" placeholder="위도" name="lat" className="plain-input-form" ref={latRef} defaultValue={props.city.lat ?? ""} onChange={(e) => setLatLng({ lat: Number(e.target.value), lng: latLng.lng })} />
          <label htmlFor="lng">경도</label>
          <input type="text" inputMode="text" placeholder="경도" name="lng" className="plain-input-form" ref={lngRef} defaultValue={props.city.lng ?? ""} onChange={(e) => setLatLng({ lat: latLng.lat, lng: Number(e.target.value) })} />
        </span>
      </section>
    </form>
  )
}