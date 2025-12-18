"use client";
import { Data, organizationIcons, organizationType } from "@/app/types/listdata"; //데이터 타입
import { CurrentLoc, IsRealtimeLocationEnabled } from "@/app/types/locationdata";
import { faCalendarCheck, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";

type Props = {
  state: string,
  city: string,
  data: Data[],
  date: string|undefined,
  setMapCenter: Dispatch<SetStateAction<CurrentLoc | undefined>>
}

export default function DataList(props: Props) {
  const useGeolocation = useContext(IsRealtimeLocationEnabled);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const currentData = useMemo(() => {
    if (!searchKeyword) return props.data;
    const initialSound = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|\\s]");
    if (initialSound.test(searchKeyword)) return props.data;
    return props.data.filter((place:Data) => {
      return place.name.includes(searchKeyword) || place.address.includes(searchKeyword)
    });
  }, [props.data, searchKeyword]);

  // 데이터 필터링(검색)
  function search(keyword: string) {
    setSearchKeyword(keyword);
  }

  return(
    <>
      <form name="resultData" onSubmit={(e) => {e.preventDefault()}}>
        <input type="text" inputMode="text" placeholder="장소명 혹은 주소로 검색하세요"
          className="plain-input-form"
          onChange={(e) => search(e.target.value)}
        />
      </form>
      <section id="info" className="flex my-1 gap-2 break-keep">
        <p className="rounded-xl shadow-md p-2">
          <span className="inline-block me-1">
            <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
          </span>
          <span className="inline-block">
            {props.date ? `${props.date} 기준` : "-"}
          </span>
        </p>
        <p className="rounded-xl shadow-md p-2">
          <span className="inline-block me-1">
            <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
          </span>
          <span className="inline-block">
            {useGeolocation && useGeolocation.value ? "가까운 순" : "최신 순"}
          </span>
        </p>
      </section>
      <section id="dataList" className="flex items-center justify-center max-h-full flex-col shrink rounded-md overflow-hidden">
        <ul className="overflow-y-scroll w-full flex flex-col gap-4 p-2">
          {currentData.map((place) => (
            <li key={place.id}>
              <Link href={`/${props.state}/${props.city}/box?id=${place.id}`}
                onClick={(e) => {props.setMapCenter({lat: Number(place.lat), lng: Number(place.lng)})}}
                className="block p-4 rounded-xl shadow-lg basis-0 shrink w-full text-start
                            no-underline hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700"
                scroll={false}>
                <span className="block">
                  <span className="inline-block rounded-xs dark:bg-slate-900 bg-slate-200 py-1 mb-2 px-2 me-2">
                    <FontAwesomeIcon 
                      icon={organizationIcons[place.type]}
                      className="pe-1" />
                    {organizationType[place.type]}
                  </span>
                  <span className="text-lg font-semibold inline-block">{place.name}</span>
                  {place.distance ? (
                    <span className="inline-block ms-2">{place.distance.toFixed(2)}km</span>
                  ):""}
                </span>
                <span className="block">{place.address}</span>
                <span className="block">{place.call ?? ""}</span>
              </Link>
            </li>
          ))}
        </ul>       
      </section>
    </>
  )
}