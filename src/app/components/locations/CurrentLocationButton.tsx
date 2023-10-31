'use client'
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons'
import { RealtimeLocationData } from "@/app/types/locationdata";
import { useContext, useEffect, useState } from "react";

export default function CurrentLocationButton() {
    const router = useRouter(); //페이지 이동
    const pageCurrentLoc = useContext(RealtimeLocationData);
    const [isGeolocationEnabled, enableGeolocation] = useState<Boolean>(false);

    //현위치 버튼 눌렀을 때의 동작
    function getGeolocation(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                sessionStorage.setItem("lat", coords.latitude.toString());
                sessionStorage.setItem("lng", coords.longitude.toString());
                const getCurrentRegion = await fetch(`/api/geo/region?lat=${coords.latitude}&lng=${coords.longitude}`);
                const currentRegion = await getCurrentRegion.json();
                const validateLocation =
                    await fetch(`/api/service/supported_region?type=geo&state=${currentRegion.state}&city=${currentRegion.city}`);
                const validateResult = await validateLocation.json();

                if (validateLocation.ok) {
                    router.push(`/${validateResult.state.code}/${validateResult.city.code}`);
                    if (pageCurrentLoc) {
                        pageCurrentLoc.set({
                            lat: coords.latitude.toString(),
                            lng: coords.longitude.toString()
                        });
                    }
                    enableGeolocation(true);
                } else {
                    alert(`${validateResult.error} 서울특별시인 경우, 스마트 서울맵을 이용하세요.`);
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
        if (pageCurrentLoc && pageCurrentLoc.value) {
            enableGeolocation(true)
        } else {
            enableGeolocation(false);
        }
    }, [pageCurrentLoc])

    function removeLocationInfo(e: React.MouseEvent<HTMLButtonElement>) {
        sessionStorage.removeItem("lat");
        sessionStorage.removeItem("lng");
    }

    return (
        <div className="flex gap-2">
            <button
                className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2"
                onClick={(e) => {getGeolocation(e)}}>
                <FontAwesomeIcon icon={faLocationCrosshairs} className="pe-1" />
                현위치
            </button>
            {isGeolocationEnabled ? (
                <button
                    className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2"
                    onClick={(e) => {removeLocationInfo(e)}}>
                    <FontAwesomeIcon icon={faEraser}className="pe-1" />
                    위치정보 지우기
                </button>
            ):""}
        </div>
    )
}
