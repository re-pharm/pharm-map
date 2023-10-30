'use client'
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";

export type CurrentLoc = {
    lat: string,
    lng: string
}

//지역 값 검증
export async function validateRegionValue(state: string, city?: string) {
    if (city) {
        const validateResult = await fetch(`/api/service/supported_region?type=geo&state=${state}&city=${city}`);
        const validateResultJson = await validateResult.json();

        if (validateResult.ok) {
            return {
                status: true,
                state: validateResultJson.state,
                city: validateResultJson.city
            }
        }
        
        return {
            status: false,
            message: validateResultJson.error
        }
    } else {
        const validateResult = await fetch(`/api/service/supported_region?type=city&state=${state}`);
        
        if (validateResult.ok) {
            return {
                status: true
            }
        }

        return {
            status: false
        }
    }    
}

export default function CurrentLocationButton() {
    const router = useRouter(); //페이지 이동
    const [currentLoc, setCurrentLocation] = useState<CurrentLoc|undefined>(undefined);

    //현위치 버튼 눌렀을 때의 동작
    function getGeolocation(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                const currentLoc = await fetch(`/api/geo/region?lat=${coords.latitude}&lng=${coords.longitude}`);
                const currentLocResult = await currentLoc.json();
                const currentRegionResult = await validateRegionValue(currentLocResult.state, currentLocResult.city);

                if (currentRegionResult.status) {
                    sessionStorage.setItem("lat", coords.latitude.toString());
                    sessionStorage.setItem("lng", coords.longitude.toString());
                    router.push(`/${currentRegionResult.state.code}/${currentRegionResult.city.code}`);
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

    useEffect(() => {
        const lat = sessionStorage.getItem("lat");
        const lng = sessionStorage.getItem("lng");
        
        if (lat && lng) {
            setCurrentLocation({
                lat: lat,
                lng: lng
            });
        } else {
            setCurrentLocation(undefined);
        }
    }, [])

    function removeCurrentLocation() {
        sessionStorage.removeItem("lat");
        sessionStorage.removeItem("lng");
        router.refresh();
    }

    return (
        <div id="locations" className="flex gap-2">
            <button 
            className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2"
            onClick={(e) => {getGeolocation(e)}}>
                <FontAwesomeIcon icon={faLocationCrosshairs} className="pe-1" />
                현위치
            </button>
            {currentLoc ? (
                <button
                className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2"
                onClick={(e) => {removeCurrentLocation()}}>
                    <FontAwesomeIcon icon={faEraser} className="pe-1" />
                    위치정보 지우기
                </button>
            ) : ""}
        </div>    
    )
}
