"use client";
import { Data, organizationIcons, organizationType } from "@/app/types/listdata"; //데이터 타입
import { RealtimeLocationData } from "@/app/types/locationdata";
import { faCalendarCheck, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

type Props = {
    state: string,
    city: string,
    data: Data[],
    date: string|undefined
}

export default function DataList(props: Props) {
    const currentLoc = useContext(RealtimeLocationData);
    const [currentData, setData] = useState<Data[]>(props.data);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    // 데이터 필터링(검색)
    function search(keyword: string) {
        const initialSound = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ|/\s/g]");
        
        if (!initialSound.test(keyword)) {
            setData(props.data.filter((place:Data) => {
                return place.name.includes(keyword) || place.location.includes(keyword)
            }));
        }
    }

    return(
        <>
        <form name="resultData">
            <input type="text" inputMode="text" placeholder="장소명 혹은 주소로 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
            onChange={(e) => search(e.target.value)}
            />
        </form>
        <section id="info" className="flex my-2 gap-2 break-keep">
            <p className="rounded-xl shadow-md p-2">
                <span className="inline-block">
                    <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
                    <span className="font-semibold pe-2">기준일</span>
                </span>
                <span className="inline-block">
                    {props.date ?? "-"}
                </span>
            </p>
            <p className="rounded-xl shadow-md p-2">
                <span className="inline-block">
                    <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
                    <span className="font-semibold pe-2">정렬 방법</span>
                </span>
                <span className="inline-block">
                    {currentLoc ? "가까운 순" : "기본 순"}
                </span>
            </p>
        </section>
        <section id="dataList" className="flex items-center justify-center max-h-full flex-col shrink rounded-md overflow-hidden">
            <ul className="overflow-y-scroll w-full flex flex-col gap-4 p-2">
            {currentData.map((place) => (
                <li key={place.location}>
                    <Link href={`/${props.state}/${props.city}/box?name=${place.name}`}
                        className="block p-4 rounded-xl shadow-lg basis-0 shrink w-full text-start no-underline dark:bg-slate-700">
                        <span className="block">
                            <span className="inline-block rounded-xl dark:bg-slate-800 bg-slate-200 py-1 px-2 me-2">
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
                        <span className="block">{place.location}</span>
                        <span className="block">{place.tel}</span>
                    </Link>
                </li>
            ))}
            </ul>       
        </section>
        </>
    )
}