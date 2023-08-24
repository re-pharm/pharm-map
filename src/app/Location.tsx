"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type StateType = {
    code: string,
    name: string
}

type Props = {
    setLatLng: Dispatch<SetStateAction<{lat: number, lng: number}>>
}

export default function Location(prop: Props) {
    const [stateList, setStates] = useState<StateType[]>([]);
    const [cityList, setCities] = useState<StateType[]>([]);
    const [selectedState, selectState] = useState<string|null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                prop.setLatLng({lat: coords.latitude, lng: coords.longitude});

            }, (error) => {
                console.log(error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            });
        }    
    }, []);

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

    return (
        <form name="findLocation" className="mt-4 mb-2 flex flex-col gap-4">
            <div id="region" className="flex flex-row gap-2">
                <select id="state" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400" onChange={(e) => selectState(e.target.value)}>
                    <option>시/도</option>
                    {stateList.map((state) => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                </select>
                <select id="city" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400">
                    <option>시/군/구</option>
                    {cityList.length > 0 && cityList.map((city) => (
                        <option key={city.code} value={city.code}>{city.name}</option>
                    ))}
                </select>
            </div>
        </form>
    )
}
