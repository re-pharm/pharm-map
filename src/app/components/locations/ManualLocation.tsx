"use client"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RegionData } from "@/app/types/listDataWithContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

type StateType = {
    code: string,
    name: string
}

export function ManualLocation() {
    const router = useRouter(); //페이지 이동

    const urlRegionData = useContext(RegionData);
    const [stateList, setStates] = useState<StateType[]>([]); //시도 목록
    const [cityList, setCities] = useState<StateType[]>([]); //시군구 목록
    const [selectedState, selectState] = useState<string|undefined>(undefined); //선택한 시도
    const [selectedCity, selectCity] = useState<string|undefined>(undefined); //선택한 시군구
    
    //"시/도" 지역 불러오기
    async function getStateData() {
        const stateData = await fetch("/api/geo/supported?type=state");
        const states: StateType[] = await stateData.json();

        setStates(states);
    }

    //"시/군/구" 지역 불러오기
    async function getCityData(state: string|null) {
        if (state) {
            const cityData = await fetch(`/api/geo/supported?type=city&state=${state}`);
            const cities: StateType[] = await cityData.json();

            setCities(cities);
        } else {
            setCities([]);
        }
    }

    //페이지 로드 시 데이터 초기화
    useEffect(() => {
        async function setData() {
            if (urlRegionData && urlRegionData.state && urlRegionData.city) {
                selectState(urlRegionData.state);
                await getCityData(urlRegionData.state);
                selectCity(urlRegionData.city);
            }
        }

        getStateData();
        setData();
    }, [urlRegionData]);

    //"시/군/구" 선택 후 버튼 눌러야 이동
    function sendRegionInfo(e: React.MouseEvent<HTMLButtonElement>,
        state:string|undefined, city: string|undefined) {

        e.preventDefault();
        if (state && city) {
            if (state !== "default" && city !== "default") {
                router.push(`/${state}/${city}/list`);
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
            <select className="w-full border-0 border-b-2 focus:border-teal-400 focus:ring-transparent
                bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                aria-label="시/도" onChange={(e) => sendStateInfo(e.target.value)} value={selectedState}>
                <option value="default">시/도</option>
                {stateList.map((state) => (
                    <option key={state.code} value={state.code}>{state.name}</option>
                ))}
            </select>
            <select className="w-full border-0 border-b-2 focus:border-teal-400 focus:ring-transparent
                bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700 dark:text-white border-slate-300 dark:border-slate-600"
                aria-label="시/군/구" value={selectedCity} onChange={(e) => selectCity(e.target.value)} autoFocus>
                <option value="default">시/군/구</option>
                {cityList.length > 0 && cityList.map((city) => (
                    <option key={city.code} value={city.code}>{city.name}</option>
                ))}
            </select>
            <button type="submit" className="border-0 border-b-2 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-700
                dark:text-white border-slate-300 dark:border-slate-600 px-2.5 focus:border-teal-400 focus:outline-hidden"
                onClick={(e) => sendRegionInfo(e, selectedState, selectedCity)} aria-label="선택한 지역으로 이동">
                <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </form>
    )
}
