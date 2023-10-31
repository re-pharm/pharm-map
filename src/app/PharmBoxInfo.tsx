"use client"
import { faRoute, faXmark, faCapsules, faBuildingColumns, faPhone, faLocationDot, faClock, faCheckDouble, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Kmap from "./components/kakaomap/Kmap";

type Data = {
    name: string,
    location: string,
    type: string,
    tel: string,
    lat: string,
    lng: string,
    distance: number
}

type Props = {
    currentData: Data | undefined,
    openModal: Dispatch<SetStateAction<boolean>>
}

type OperationData = {
    start: number,
    end: number
}

export default function PharmBoxInfo(prop: Props) {
    const [operationInfo, setOperationHour] = useState<OperationData[]>([]); //0~7 월~일
    const days = ["월", "화", "수", "목", "금", "토", "일", "공휴일"];
    
    function closeModal() {
        prop.openModal(false);
    }

    useEffect(() => {
        async function getOperationData() {
            if (prop.currentData) {
                if (prop.currentData.type === "pharm") {
                    const state = prop.currentData.location.split(" ")[0];
                    const city = prop.currentData.location.split(" ")[1];
                    const operationData = await fetch(`/api/service/pharm/info?state=${state}&city=${city}&name=${prop.currentData.name}`);
                    const operationJson = await operationData.json();
                    const operationArray: OperationData[] = [];

                    if (operationData.ok) {
                        for (let i = 1; i < 9; i++) {
                            if(operationJson.data[`dutyTime${i}s`]) {
                                operationArray.push({
                                    start: operationJson.data[`dutyTime${i}s`],
                                    end: operationJson.data[`dutyTime${i}c`]
                                });    
                            }
                        }
                        setOperationHour(operationArray);
                    }
                }
            }
        }

        getOperationData();
    }, [prop.currentData])


    const component = prop.currentData && (
        <>
            <header className="flex justify-between">
                <h1 className="text-3xl font-semibold flex">
                    <span className="w-max text-xl rounded-xl dark:bg-slate-800 bg-slate-200 py-1 px-2 me-2">
                        <FontAwesomeIcon 
                        icon={prop.currentData?.type === "pharm" ? faCapsules : faBuildingColumns}
                        className="pe-1" />
                        {prop.currentData?.type === "pharm" ? "약국" : "관공서"}
                    </span>
                    <span className="md:w-auto lg:w-max w-max md:break-all lg:break-keep">{prop.currentData?.name}</span>
                </h1>
                <button 
                    className="rounded-xl hover:bg-slate-200 hover:dark:bg-slate-600 px-3 ms-2"
                    onClick={() => {closeModal()}}
                >
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </header>
            <p className="flex gap-2 w-max">
                <a 
                    href={`https://map.kakao.com/link/to/${prop.currentData?.name},${prop.currentData?.lat},${prop.currentData?.lng}`}
                    target="_blank"
                    className="no-underline p-2 mt-1 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-xl"
                >
                    <FontAwesomeIcon icon={faRoute} className="pe-1" />
                    <span className="font-semibold">길찾기</span>
                </a>
                <a
                    href={`tel:${prop.currentData?.tel}`}
                    className="no-underline p-2 mt-1 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-xl"
                >
                    <FontAwesomeIcon icon={faPhone} className="pe-1" />
                    <span className="font-semibold">전화하기</span> {prop.currentData?.tel}
                </a>
            </p>
            <p id="location">
                <FontAwesomeIcon icon={faLocationDot} className="pe-2" />
                <span>{prop.currentData?.location}</span>
            </p>
            {operationInfo.length > 0 && prop.currentData?.type === "pharm" && (
                <section id="operationHours" className="flex mt-2">
                    <FontAwesomeIcon icon={faClock} className="pe-2 mt-1" />
                    <ul>
                        {operationInfo.map((data: OperationData, index) => (
                            <li key={index}>
                                <span className="font-semibold pe-2">{days[index]}</span>
                                {data.start >= 1000 ? 
                                    `${data.start.toString().slice(0, 2)}:${data.start.toString().slice(2)}`
                                    : `${data.start.toString().slice(0, 1)}:${data.start.toString().slice(1)}`}
                                &nbsp;~&nbsp;
                                {data.end >= 1000 ? 
                                    `${data.end.toString().slice(0, 2)}:${data.end.toString().slice(2)}`
                                    : `${data.end.toString().slice(0, 1)}:${data.end.toString().slice(1)}`}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
            <section id="dataSource" className="flex gap-2 mt-2">
                <div className="flex items-start">
                    <FontAwesomeIcon icon={faCheckDouble} className="me-2 mt-1" />
                    <span className="font-semibold">출처</span>
                </div>
                <ul>
                    <li>
                        {`${prop.currentData?.location.split(" ")[0].endsWith("도") ? 
                            prop.currentData?.location.split(" ")[1]
                            :prop.currentData?.location.split(" ")[0]} 폐의약품 수거함 공공데이터`}
                    </li>
                    {operationInfo.length > 0 ? (
                        <li>
                            <a href="https://www.nmc.or.kr/nmc/main/contents.do?menuNo=200553" target="blank">
                                국립중앙의료원 약국 정보 공공데이터
                            </a>
                        </li>
                    )
                    : ""}
                </ul>
            </section>
            <section id="caution" className="flex gap-2 mt-2">
                <div className="flex items-start">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2 mt-1" />
                    <span className="font-semibold">안내</span>
                </div>
                <p>
                    공공 데이터 자료는 특성상 기준일 이후 전화번호, 운영 시간 등이 변경될 수 있으므로,&nbsp;
                    <a href={`https://map.kakao.com/link/search/${prop.currentData?.name}`} target="_blank">카카오맵</a>
                    &nbsp;혹은&nbsp;
                    <a href={`https://map.naver.com/p/search/${prop.currentData?.name}`} target="_blank">네이버 지도</a>
                    에서 장소를 찾아보시거나 직접 전화하시어 다시 한 번 확인하세요.
                </p>
            </section>
        </>
    );

    return (
        <>
            <dialog className="shadow-lg rounded-xl p-4 max-w-[calc(100%-1rem)] z-50 inset-y-1/3 lg:inset-1/2 dark:text-white md:hidden lg:block block" open>
                {component}
            </dialog>
            <section className="shadow-lg rounded-xl md:block m-4 p-4 shrink hidden lg:hidden">
                {component}
            </section>
        </>
    );
}
