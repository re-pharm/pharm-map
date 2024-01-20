"use client"
/* Stylesheets */
import "../../../page.css";
/* Types and Data */
import { CurrentLoc, IsRealtimeLocationEnabled } from "@/app/types/locationdata";
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
    const [defaultLoc, setDefaultLocation] = useState<CurrentLoc|undefined>({ lat: 37.65841, lng: 126.83196});
    const [locProvided, enableDistanceCalculate] = useState<Boolean>(false);
    const router = useRouter();

    useEffect(() => {
        async function validateDataList() {
            const validData =
                    await fetch(`/api/service/supported_region?type=current&state=${
                        params.state}&city=${params.city}`).then((res) => res.json());
            const lat = sessionStorage.getItem("lat");
            const lng = sessionStorage.getItem("lng");
            const state = sessionStorage.getItem("state");
            const city = sessionStorage.getItem("city");
            
            if (validData) {
                //데이터 불러오기
                const pharmBoxData = 
                    await fetch(`/api/service/list?${
                        `state=${params.state}&city=${params.city}&integrated=${validData.integrated}`}`)
                        .then(async (data) => await data.json());

                const latest_date = new Date(pharmBoxData.data[0].last_updated);

                //기준 날짜 설정
                setDataDate(latest_date.toLocaleDateString("ko-KR"));

                //위치 정보 여부 확인
                if (lat && lng) {
                    if (locProvided) {
                        // 거리 계산
                        const dataWithDistance = insertDistanceInfo(pharmBoxData.data, lat, lng);
    
                        //정렬 및 데이터 삽입
                        setData(dataWithDistance.sort((a:Data, b: Data) => sortDistance(a, b)));
                        // 현 위치와 찾고자 하는 지역이 같으면 지도 위치 현 위치로 설정
                        if (params.state === state && params.city === city) {
                            setDefaultLocation({
                                lat: Number(lat),
                                lng: Number(lng)
                            });
                        } else {
                            setDefaultLocation({
                                lat: Number(validData.lat), 
                                lng: Number(validData.lng)
                            });
                        }
                    } else {
                        enableDistanceCalculate(true);
                    }
                } else {
                    setData(pharmBoxData.data);
                    setDefaultLocation({
                        lat: Number(validData.lat), 
                        lng: Number(validData.lng)
                    });
                }
            } else {
                alert(`URL을 잘못 입력하셨거나 서버가 불안정합니다. 초기 화면으로 돌아갑니다.`);
                router.replace("/");
            }
        }
        
        validateDataList();
    }, [params.city, params.state, locProvided, router]);

    return(
        <>
        <IsRealtimeLocationEnabled.Provider value={{
            value: locProvided,
            set: enableDistanceCalculate
        }}>
        <RegionData.Provider value={{
            state: params.state,
            city: params.city  
        }}>
            <div id="mainData" className="w-full sm:w-fit flex flex-col md:h-[calc(100vh-6rem)]">
                <Header />
                <main className="h-full flex flex-col overflow-hidden">
                    <ManualLocation />
                    <DataList state={params.state} city={params.city} data={data} date={date}
                        setMapCenter={setDefaultLocation} />
                </main>
            </div>
            <Kmap latLng={defaultLoc ?? { lat: 37.65841, lng: 126.83196}}
                data={data} />
        </RegionData.Provider>
        </IsRealtimeLocationEnabled.Provider>
        </>
    )
}

export const runtime = 'edge';