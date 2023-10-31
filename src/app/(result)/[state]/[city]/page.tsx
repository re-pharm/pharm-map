"use client"
/* Stylesheets */
import "../../../page.css";
/* Types and Data */
import { CurrentLoc, RealtimeLocationData } from "@/app/types/locationdata";
import { Data, RegionData } from "@/app/types/listdata";
/* Functions */
import { insertDistanceInfo, sortDistance } from "@/app/functions/data/calcDistance";
/* Components */
import Kmap from "@/app/components/kakaomap/Kmap";
import Header from "@/app/components/layouts/Header";
import DataList from "@/app/components/listing/DataList";
import { ManualLocation } from "@/app/components/locations/ManualLocation";
/* External Libraries */
import { faCalendarCheck, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Params = { params: {
    state: string,
    city: string
}};

// 페이지 시작점
export default function Page({ params }: Params) {
    const [data, setData] = useState<Data[]>([]);
    const [date, setDataDate] = useState<string|undefined>(undefined);
    const [currentLoc, setCurrentLocation] = useState<CurrentLoc|undefined>(undefined);
    const router = useRouter();


    // 데이터 필터링(검색)
    function search(keyword: string) {
        const initialSound = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ]");
        
        if (!initialSound.test(keyword)) {
            setData(data.filter((place:Data) => {
                place.name.includes(keyword) || place.location.includes(keyword)
            }));
        }
    }

    useEffect(() => {
        async function validateDataList() {
            const validateData =
                    await fetch(`/api/service/supported_region?type=geo&state=${params.state}&city=${params.city}`);
            const lat = sessionStorage.getItem("lat");
            const lng = sessionStorage.getItem("lng");
            
            if (validateData.ok) {
                //데이터 불러오기
                const pharmBoxData = 
                    await fetch(`/api/service/${params.state}/${params.city}`).then(async (data) => await data.json());
                //기준 날짜 설정
                setDataDate(pharmBoxData.date);

                //위치 정보 여부 확인
                if (lat && lng) {
                    const dataWithDistance = insertDistanceInfo(pharmBoxData.data, lat, lng);
                    //위치 정보 설정
                    setCurrentLocation({
                        lat: lat,
                        lng: lng
                    });
                    //정렬 및 데이터 삽입
                    setData(dataWithDistance.sort((a:Data, b: Data) => sortDistance(a, b)));
                } else {
                    setData(pharmBoxData.data);
                }
            } else {
                alert(`URL을 잘못 입력하셨거나, 찾고 계신 지역을 지원하지 않습니다. 서울특별시인 경우, 스마트 서울맵을 이용하세요.`);
                router.replace("/");
            }
        }
        
        validateDataList();
    }, [params.city, params.state, router]);

    return(
        <>
        <RealtimeLocationData.Provider value={{
            value: currentLoc,
            set: setCurrentLocation
        }}>
        <RegionData.Provider value={{
            state: params.state,
            city: params.city  
        }}>
            <div id="mainData" className="w-full sm:w-fit px-8 pt-8 flex flex-col h-[calc(100vh-4rem)]">
                <Header />
                <main className="h-full flex flex-col overflow-hidden">
                    <ManualLocation />
                    <form name="resultData">
                        <input type="text" inputMode="text" placeholder="장소명 혹은 주소로 검색하세요"
                        className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
                        onChange={(e) => search(e.target.value)}
                        />
                    </form>
                    <section id="info" className="flex my-2 gap-2">
                        <p className="rounded-xl shadow-md p-2">
                            <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
                            <span className="font-semibold pe-2">기준일</span>
                            {date ?? "-"}
                        </p>
                        <p className="rounded-xl shadow-md p-2">
                            <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
                            <span className="font-semibold pe-2">정렬 방법</span>
                            {currentLoc ? "가까운 순" : "기본 순"}
                        </p>
                    </section>
                    <DataList state={params.state} city={params.city} data={data} />
                </main>
            </div>
            <Kmap latLng={{ 
                    lat: currentLoc ? Number(currentLoc.lat) : 37.65838, 
                    lng: currentLoc ? Number(currentLoc.lng) : 126.83187
                }}
                data={data} />
        </RegionData.Provider>
        </RealtimeLocationData.Provider>
        </>
    )
}