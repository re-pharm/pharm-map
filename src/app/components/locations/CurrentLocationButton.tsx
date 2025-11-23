'use client'
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser, faLocationCrosshairs, faXmark } from '@fortawesome/free-solid-svg-icons'
import { IsRealtimeLocationEnabled } from "@/app/types/locationdata";
import { ERROR } from "@/app/types/errormessages";
import { useContext, useEffect, useState } from "react";

export default function CurrentLocationButton() {
    const router = useRouter(); //페이지 이동
    const useGeolocation = useContext(IsRealtimeLocationEnabled);
    const [errorMessage, setErrorMessage] = useState<String|null>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout|null>(null);

    // 에러 메시지 설정
    function openErrorMessage(message: string) {
        setErrorMessage(message);
        setTimer(setTimeout(function autoHide() {
            setErrorMessage(null);
        }, 3500));
    }

    function closeErrorMessage() {
        setErrorMessage(null);
        if (timer) {
            clearTimeout(timer);
        }
    }

    //현위치 버튼 눌렀을 때의 동작
    function getGeolocation(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async ({ coords }) => {
                sessionStorage.setItem("lat", coords.latitude.toString());
                sessionStorage.setItem("lng", coords.longitude.toString());
                const getCurrentRegion = await fetch(`/api/geo/coords2address?lat=${coords.latitude}&lng=${coords.longitude}`);
                const currentRegion = await getCurrentRegion.json();
                const validateLocation =
                    await fetch(`/api/geo/supported?type=geo&state=${currentRegion.state}&city=${currentRegion.city}`);
                const validateResult = await validateLocation.json();

                if (validateLocation.ok) {
                    router.push(`/${validateResult.state}/${validateResult.city}/list`);
                    sessionStorage.setItem("state", validateResult.state);
                    sessionStorage.setItem("city", validateResult.city);
                    if (useGeolocation) {
                        useGeolocation.set(true);
                    }
                } else {
                    openErrorMessage(`${validateResult.error}`);
                }
            }, (error) => {
                if (error.code) {
                    switch(error.code) {
                        case 3:
                            openErrorMessage(ERROR.TIMEOUT);
                            break;
                        case 2:
                            openErrorMessage(ERROR.POSITION_UNKNOWN);
                            break;
                        case 1:
                            openErrorMessage(ERROR.PERMISSION);
                            break;
                        default:
                            openErrorMessage(ERROR.UNKNOWN);
                            break;
                    }
                }
            }, {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000
            });
        }
    }

    function removeLocationInfo(e: React.MouseEvent<HTMLButtonElement>) {
        sessionStorage.removeItem("lat");
        sessionStorage.removeItem("lng");
        sessionStorage.removeItem("state");
        sessionStorage.removeItem("city");
        useGeolocation?.set(false);
        router.refresh();
    }

    return (
        <div className="flex gap-2">
            {errorMessage ? (
                <section className="rounded-xl shadow-md p-2 flex z-50 absolute bg-white dark:bg-black items-center">
                    <p>{errorMessage}</p>
                    <button className="hover:bg-slate-200 dark:hover:bg-slate-600 dark:bg-slate-800 rounded-xl px-2"
                        onClick={(e) => {closeErrorMessage()}}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </section>
            ): ""}
            <button
                className="plain-btn"
                onClick={(e) => {getGeolocation(e)}}>
                <span className="pe-1">
                    <FontAwesomeIcon icon={faLocationCrosshairs} />
                </span>
                {useGeolocation && useGeolocation.value ? "위치 갱신" : "현위치"}
            </button>
            {useGeolocation && useGeolocation.value ? (
                <button className="plain-btn" onClick={(e) => {removeLocationInfo(e)}}>
                    <span className="pe-1">
                        <FontAwesomeIcon icon={faEraser} />
                    </span>
                    위치 지우기
                </button>
            ):""}
        </div>
    )
}
