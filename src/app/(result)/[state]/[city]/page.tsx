"use client"
/* Stylesheets */
import "../../../page.css";
/* Types and Data */
import { CurrentLoc, RealtimeLocationData } from "@/app/types/locationdata";
import { Data } from "@/app/types/listdata";
import { RegionData } from "@/app/types/listDataWithContext";
/* Functions */
import { insertDistanceInfo, sortDistance } from "@/app/functions/data/calcDistance";
/* Components */
import Kmap from "@/app/components/kakaomap/Kmap";
import Header from "@/app/components/layouts/Header";
import DataList from "@/app/components/data/DataList";
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
    const [defaultLocation, setDefaultLocation] = useState<CurrentLoc>({ lat: "37.65841", lng: "126.83196"});
    const [currentLoc, setCurrentLocation] = useState<CurrentLoc|undefined>(undefined);
    const router = useRouter();

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
                setDefaultLocation(pharmBoxData.center);

                //위치 정보 여부 확인
                if (!currentLoc && lat && lng) {
                    //위치 정보 설정
                    setCurrentLocation({
                        lat: lat,
                        lng: lng
                    });
                }

                if (currentLoc) {
                    const dataWithDistance = insertDistanceInfo(pharmBoxData.data, 
                        currentLoc.lat, currentLoc.lng);
                    
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
    }, [params.city, params.state, currentLoc, router]);

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
            <div id="mainData" className="w-full sm:w-fit flex flex-col h-[calc(100vh-6rem)]">
                <Header />
                <main className="h-full flex flex-col overflow-hidden">
                    <ManualLocation />
                    <DataList state={params.state} city={params.city} data={data} date={date} />
                </main>
            </div>
            <Kmap latLng={{ 
                    lat: currentLoc ? Number(currentLoc.lat) : Number(defaultLocation.lat), 
                    lng: currentLoc ? Number(currentLoc.lng) : Number(defaultLocation.lng)
                }}
                data={data} />
        </RegionData.Provider>
        </RealtimeLocationData.Provider>
        </>
    )
}