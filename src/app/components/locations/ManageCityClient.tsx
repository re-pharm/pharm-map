"use client";
import { getCities, toggleCityAvailability } from "@/app/admin/regions/actions";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SyncSGISButton } from "./SyncSGISButton";
import ManageCityInfoClient from "./ManageCityInfoClient";

export type City = {
  id: number;
  name: string;
  code: string;
  avail: boolean;
  lat: number | null;
  lng: number | null; 
  state: string | null;
  origin: string | null;
}

export default function ManageCityClient(props: { code: string }) {
  const [cities, setCities] = useState<City[]>([]);
  const [isCityInfoEnabled, setIsCityInfoEnabled] = useState<City|undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    const supported_cities = await getCities(props.code);
    setCities(supported_cities);
  }, [props.code]);

  useEffect(() => {
    fetchCities();
  }, [props.code, fetchCities]);

  function handleToggle(code: string, currentAvail: boolean) {
    setPendingCode(code);

    setCities((prev) =>
      prev.map((city) =>
        city.code === code ? { ...city, avail: !currentAvail } : city
      )
    );

    startTransition(async () => {
      try {
        await toggleCityAvailability(code, currentAvail);
      } catch (error) {
        setCities((prev) =>
          prev.map((city) =>
            city.code === code ? { ...city, avail: currentAvail } : city
          )
        );
        console.error("Failed to update city availability:", error);
      } finally {
        setPendingCode(null);
      }
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4 gap-2 w-max">
          <h4 className="text-xl">등록된 시/군/구 목록</h4>
          {cities.length === 0 && <SyncSGISButton isCity={true} code={props.code} onSuccess={fetchCities} />}
        </div>

        {cities.length === 0 ? (
          <p className="text-gray-500">
            등록된 시/군/구가 없습니다.
          </p>
        ) : (
          <ul id="add-states-from-list" className="overflow-y-scroll rounded-xl max-h-[68vh] flex flex-col gap-2 p-2 shrink-0">
            {cities.map((city) => (
              <li key={city.code} className="flex p-2 rounded-xl shadow-lg basis-0 w-full text-start justify-between items-center bg-white" onClick={() => setIsCityInfoEnabled(city)}>
                <h2 className="text-lg font-bold mb-2">
                  {city.name} ({city.code})
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">서비스</span>
                  <button
                    onClick={() => handleToggle(city.code, city.avail)}
                    disabled={isPending && pendingCode === city.code}
                    className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${city.avail ? "bg-blue-600" : "bg-gray-300"}
              `}
                    role="switch"
                    aria-checked={city.avail}
                  >
                    <span
                      className={`
                  inline-block h-4 w-4 transform rounded-full bg-white
                  transition-transform duration-200 ease-in-out shadow-sm
                  ${city.avail ? "translate-x-6" : "translate-x-1"}
                `}
                    />
                  </button>
                  <span className={`text-sm font-medium ${city.avail ? "text-blue-600" : "text-gray-500"}`}>
                    {city.avail ? "ON" : "OFF"}
                  </span>
                  {isPending && pendingCode === city.code && (
                    <span className="text-xs text-gray-400 animate-pulse">저장 중...</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isCityInfoEnabled && (
        <ManageCityInfoClient city={isCityInfoEnabled} key={isCityInfoEnabled.code} onSuccess={fetchCities} />
      )}
    </>
  );
}