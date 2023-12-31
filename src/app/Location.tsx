"use client"
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

type StateType = {
    code: string,
    name: string
}

type Props = {
    setLatLng: Dispatch<SetStateAction<{lat: number, lng: number}>>,
    setRegion: Dispatch<SetStateAction<{state: string|null, city: string|null}>>,
    setGeoEnabled: Dispatch<SetStateAction<boolean>>
}

export default function Location(prop: Props) {
    const [stateList, setStates] = useState<StateType[]>([]); //시도 목록
    const [cityList, setCities] = useState<StateType[]>([]); //시군구 목록
    const [selectedState, selectState] = useState<string|null>(null); //선택한 시도 (현위치)
    const [selectedCity, selectCity] = useState<string|null>(null); //선택한 시군구 (현위치)
    const stateSelectBox = useRef<HTMLSelectElement>(null); //시도 선택상자
    const citySelectBox = useRef<HTMLSelectElement>(null); //시군구 선택상자

    function getGeolocation(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                prop.setGeoEnabled(true);
                prop.setLatLng({lat: coords.latitude, lng: coords.longitude});
                const currentLoc = await fetch(`/api/geo/region?lat=${coords.latitude}&lng=${coords.longitude}`);
                const currentLocResult = await currentLoc.json();
                
                const currentRegion = await fetch(`/api/service/region?type=geo&state=${currentLocResult.state}&city=${currentLocResult.city}`);
                const currentRegionResult = await currentRegion.json();

                if (currentRegion.ok) {
                    if (stateSelectBox.current !== null) {
                        stateSelectBox.current.value = currentRegionResult.state.code;
                        selectState(currentRegionResult.state.code);
                        selectCity(currentRegionResult.city.code);
                    }
                } else {
                    alert("현재 지역은 지원하지 않습니다. 서울특별시인 경우, 스마트 서울맵을 이용하세요.");
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

    useEffect(() => {
        async function getStateData() {
            const stateData = await fetch("/api/service/region?type=state");
            const states: StateType[] = await stateData.json();

            setStates(states);
        }

        getStateData();
    }, []);

    useEffect(() => {
        async function getCityData(state: string) {
            const cityData = await fetch(`/api/service/region?type=city&state=${state}`);
            const cities: StateType[] = await cityData.json();

            setCities(cities);
            selectState(null);
        }

        if (selectedState !== null) {
            getCityData(selectedState);
        }
    }, [selectedState])

    useEffect(() => {
        if(selectedCity && citySelectBox.current && cityList.length > 0 && stateSelectBox.current) {
            citySelectBox.current.value = selectedCity;
            prop.setRegion({state: stateSelectBox.current.value, city: selectedCity});
            selectCity(null);
        }
    }, [selectedCity, cityList]);

    function sendRegionInfo(state:string|undefined, city: string|undefined) {
        if (state && city) {
            if (state !== "default" && city !== "default") {
                prop.setRegion({state: state, city: city});
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
                <select ref={stateSelectBox} className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400" onChange={(e) => selectState(e.target.value)}>
                    <option value="default">시/도</option>
                    {stateList.map((state) => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                </select>
                <select ref={citySelectBox} className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400" onChange={(e) => sendRegionInfo(stateSelectBox.current?.value, e.target.value)}>
                    <option value="default">시/군/구</option>
                    {cityList.length > 0 && cityList.map((city) => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
        </form>
    )
}
