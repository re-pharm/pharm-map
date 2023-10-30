"use client"
import { useEffect, useState } from "react"
import { validateRegionValue } from "./CurrentLocationButton"
import { useRouter } from "next/navigation"

type Props = {
    state?: string,
    city?: string
}

type StateType = {
    code: string,
    name: string
}

export function ManualLocation(prop: Props) {
    const router = useRouter(); //페이지 이동

    const [stateList, setStates] = useState<StateType[]>([]); //시도 목록
    const [cityList, setCities] = useState<StateType[]>([]); //시군구 목록
    const [selectedState, selectState] = useState<string|undefined>(undefined); //선택한 시도
    const [selectedCity, selectCity] = useState<string|undefined>(undefined); //선택한 시군구
    
    //"시/도" 지역 불러오기
    async function getStateData() {
        const stateData = await fetch("/api/service/supported_region?type=state");
        const states: StateType[] = await stateData.json();

        setStates(states);
    }

    //"시/군/구" 지역 불러오기
    async function getCityData(state: string|null) {
        if (state) {
            const cityData = await fetch(`/api/service/supported_region?type=city&state=${state}`);
            const cities: StateType[] = await cityData.json();

            setCities(cities);
        } else {
            setCities([]);
        }
    }

    //페이지 로드 시 데이터 초기화
    useEffect(() => {
        //URL 데이터 존재 시 
        async function initURLData() {
            if (prop.state && prop.city) {
                const result = await validateRegionValue(prop.state, prop.city);
                if (result.status) {
                    selectState(prop.state);
                    await getCityData(prop.state);
                    selectCity(prop.city);
                } else {
                    alert(`${result.message} 서울특별시인 경우, 스마트 서울맵을 이용하세요.`);
                }
            }
        }

        getStateData();
        initURLData();
    }, [prop.state, prop.city]);

    //"시/군/구" 선택 후 이동
    function sendRegionInfo(state:string|undefined, city: string|undefined) {
        if (state && city) {
            if (state !== "default" && city !== "default") {
                router.push(`/${state}/${city}`);
            }
        }
    }

    function sendStateInfo(state: string) {
        selectState(state);
        if (state !== "default") {
            getCityData(state);
        } else {
            getCityData(null);
        }
    }

    return (
        <form name="manualLocation" className="my-2 flex gap-2">
            <select className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400"
                onChange={(e) => sendStateInfo(e.target.value)} value={selectedState}>
                <option value="default">시/도</option>
                {stateList.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                ))}
            </select>
            <select className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400"
                onChange={(e) => sendRegionInfo(selectedState, e.target.value)} value={selectedCity}>
                <option value="default">시/군/구</option>
                {cityList.length > 0 && cityList.map((city) => (
                    <option key={city.code} value={city.code}>{city.name}</option>
                ))}
            </select>
        </form>
    )
}