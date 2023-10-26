"use client"
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

type StateType = {
    code: string,
    name: string
}

type ParamValue = {
    state?: string,
    city?: string
}

export default function Location() {
    const router = useRouter(); //페이지 이동
    const currentValue: ParamValue = useParams(); //현재 주소에 등록된 값
    
    const [stateList, setStates] = useState<StateType[]>([]); //시도 목록
    const [cityList, setCities] = useState<StateType[]>([]); //시군구 목록
    const [selectedState, selectState] = useState<string|undefined>(undefined); //선택한 시도
    const [selectedCity, selectCity] = useState<string|undefined>(undefined); //선택한 시군구
    
    //지역 값 검증
    async function validateRegionValue(state: string, city: string) {
        const validateResult = await fetch(`/api/service/region?type=geo&state=${state}&city=${city}`);
        const validateResultJson = await validateResult.json();

        if (validateResult.ok) {
            return {
                status: true,
                state: validateResultJson.state,
                city: validateResultJson.city
            }
        } else {
            return {
                status: false,
                message: validateResultJson.error
            }
        }
    }

    //현위치 버튼 눌렀을 때의 동작
    function getGeolocation(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                const currentLoc = await fetch(`/api/geo/region?lat=${coords.latitude}&lng=${coords.longitude}`);
                const currentLocResult = await currentLoc.json();
                const currentRegionResult = await validateRegionValue(currentLocResult.state, currentLocResult.city);

                if (currentRegionResult.status) {
                    router.push(`/${currentRegionResult.state.code}/${currentRegionResult.city.code}?lat=${coords.latitude}&lng=${coords.longitude}`);
                } else {
                    alert(`${currentRegionResult.message} 서울특별시인 경우, 스마트 서울맵을 이용하세요.`);
                }
            }, (error) => {
                console.log(error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            });
        }
    }

    //"시/도" 지역 불러오기
    async function getStateData() {
        const stateData = await fetch("/api/service/region?type=state");
        const states: StateType[] = await stateData.json();

        setStates(states);
    }

    //"시/군/구" 지역 불러오기
    async function getCityData(state: string) {
        const cityData = await fetch(`/api/service/region?type=city&state=${state}`);
        const cities: StateType[] = await cityData.json();

        setCities(cities);
    }

    //페이지 로드 시 데이터 초기화
    useEffect(() => {
        //URL 데이터 존재 시 
        async function initURLData() {
            if (currentValue.state && currentValue.city) {
                const result = await validateRegionValue(currentValue.state, currentValue.city);
                if (result.status) {
                    selectState(currentValue.state);
                    selectCity(currentValue.city);
                } else {
                    alert(`${result.message} 서울특별시인 경우, 스마트 서울맵을 이용하세요.`);
                }
            }
        }

        getStateData();
        initURLData();
    }, [currentValue.state, currentValue.city]);

    //"시/도" 선택 시 "시/군/구" 데이터 가져오기
    useEffect(() => {
        if (selectedState !== undefined) {
            getCityData(selectedState);
        }
    }, [selectedState])

    //"시/군/구" 선택 후 이동
    function sendRegionInfo(state:string|undefined, city: string|undefined) {
        if (state && city) {
            if (state !== "default" && city !== "default") {
                router.push(`/${state}/${city}`);
            }
        }
    }

    return (
        <form name="findLocation" className="my-2 flex flex-col gap-2">
            <div id="buttonSet" className="flex gap-2">
                <button className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2" onClick={(e) => {getGeolocation(e)}}>
                    <FontAwesomeIcon icon={faLocationCrosshairs} className="pe-1" />
                    현위치
                </button>
                <a href="https://forms.gle/EST5vaZBFGy8DHGE8" target="_blank"
                    className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2 no-underline">
                    <FontAwesomeIcon icon={faPaperPlane} className="pe-1" />
                    문의/제보
                </a>
            </div>
            <div id="region" className="flex flex-row gap-2">
                <select className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400" onChange={(e) => selectState(e.target.value)} value={selectedState}>
                    <option value="default">시/도</option>
                    {stateList.map((state) => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                </select>
                <select className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400" onChange={(e) => sendRegionInfo(selectedState, e.target.value)} value={selectedCity}>
                    <option value="default">시/군/구</option>
                    {cityList.length > 0 && cityList.map((city) => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
        </form>
    )
}
