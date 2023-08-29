"use client"
import './page.css'
import { useEffect, useRef, useState } from 'react';
import Kmap from './Kmap';
import Location from './Location';
import PharmBoxInfo from './PharmBoxInfo';
import { faCapsules, faBuildingColumns, faArrowUpWideShort, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Data = {
  name: string,
  location: string,
  tel: string,
  type: string,
  lat: string,
  lng: string,
  distance: number
}

type OrganizationType = {
  [index: string]: string
}

function getDistanceKm(current: {lat: number, lng: number}, place: {lat: string, lng: string}) {
  const radLat1 = Math.PI * current.lat / 180;
  const radLat2 = Math.PI * Number(place.lat) / 180;
  const radTheta = Math.PI * (current.lng - Number(place.lng)) / 180;
  let distance = 
    Math.sin(radLat1) * Math.sin(radLat2) + 
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (distance > 1)
      distance = 1;

  return Math.acos(distance) * 180 / Math.PI * 60 * 1.1515 * 1.609344;
}

export default function Home() {
  const [latLng, setLatLng] = useState({lat: 33.450701, lng: 126.570667});
  const [isGeolocationEnabled, setGeoEnabled] = useState(false);
  const [region, setRegion] = useState<{state: string|null, city: string|null}>({state: null, city: null});
  const [registeredDate, setRegDate] = useState<string>("");
  const [dataList, setDataList] = useState<Data[]>([]);
  const [visibleData, setVisibleData] = useState<Data[]>([]);
  const [currentData, setCurrentData] = useState<Data>();
  const [isDataError, setIsDataError] = useState(false);
  const [isPlaceModalOpened, setIsPlaceModalOpened] = useState(false);
  const pharmName = useRef<HTMLInputElement>(null);

  const organizationType : OrganizationType = {
    pharm: "약국",
    public: "공공기관"
  }
  const initialSound = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ]");

  function search() {
    const searchKeyword = pharmName.current ? pharmName.current.value : "";
    if (!initialSound.test(searchKeyword)) {
      setVisibleData(dataList.filter((data) => 
        data.name.includes(searchKeyword) || data.location.includes(searchKeyword)));
    }
  }

  useEffect(() => {
    async function getRegionData() {
      const regionData = await fetch(`/api/service/${region.state}/${region.city}`);
      const regionJson = await regionData.json();
      const data: Data[] = [];

      if (regionData.ok) {
        regionJson.data.forEach((place:Data) => {
          data.push({
            name: place.name,
            location: place.location,
            tel: place.tel,
            lat: place.lat,
            lng: place.lng,
            type: place.type,
            distance: getDistanceKm(
              {lat: latLng.lat, lng: latLng.lng}, 
              {lat: place.lat, lng: place.lng}
            )
          });
        });

        setDataList(isGeolocationEnabled ? data.sort((a, b) => a.distance - b.distance) : data);
        setVisibleData(isGeolocationEnabled ? data.sort((a, b) => a.distance - b.distance) : data);
        setRegDate(regionJson.date);
      } else {
        setIsDataError(true);
      }
    }

    if (region.state !== null) {
      getRegionData();
    }
  }, [region]);

  return (
    <main className="flex h-full">
      <section id="search" className="w-full sm:w-fit px-8 pt-8 flex flex-col h-[calc(100vh-4rem)]">
        <h1 className="text-2xl">
          <a href="/" className="no-underline">
            <span className="blockText text-sm">우리동네</span>
            폐의약품 수거지도 💊
          </a>
        </h1>
        <Location setLatLng={setLatLng} setRegion={setRegion} setGeoEnabled={setGeoEnabled} />
        <form name="resultData" onChange={() => {search()}} onSubmit={(e) => {
              e.preventDefault();
              search();
          }}>
          <input type="text" inputMode="text" ref={pharmName} placeholder="장소명 혹은 주소로 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
          />
        </form>
        {!isDataError && (
          <>
            <section id="info" className="flex my-2 gap-2">
              <p className="rounded-xl shadow-lg p-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
                <span className="font-semibold pe-2">기준일</span>
                {registeredDate ? registeredDate : "-"}
              </p>
              <p className="rounded-xl shadow-lg p-2">
                <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
                <span className="font-semibold pe-2">정렬 방법</span>
                {isGeolocationEnabled ? "가까운 순" : "기본 순"}
              </p>
            </section>
            <ul className="rounded-xl overflow-y-scroll w-full md:w-96 h-min flex flex-col gap-4 p-2">
            {visibleData.length > 0 ? visibleData.map((place) => (
              <li key={place.location} className="w-full">
              <button
                className="rounded-xl shadow-lg p-4 basis-0 shrink w-full text-start dark:bg-slate-700" 
                onClick={(e) => {
                  setCurrentData(place);
                  setIsPlaceModalOpened(true);
              }}>
                <span className="block">
                  <span className="inline-block rounded-xl dark:bg-slate-800 bg-slate-200 py-1 px-2 me-2">
                    <FontAwesomeIcon 
                      icon={place.type === "pharm" ? faCapsules : faBuildingColumns}
                      className="pe-1" />
                    {organizationType[place.type]}
                  </span>
                  <span className="text-lg font-semibold inline-block">{place.name}</span>
                  {isGeolocationEnabled && (
                    <span className="inline-block ms-2">{place.distance.toFixed(2)}km</span>
                  )}
                </span>
                <span className="block">{place.location}</span>
                <span className="block">{place.tel}</span>
              </button>
              </li>
            )) : (
              <p className="text-center m-4">&apos;현위치&apos;를 눌러 확인하시거나, 시/도 및 시/군/구를 선택하세요.</p>
            )}
            </ul>
          </>
        )}
      </section>
      <Kmap latLng={latLng} data={dataList} />
      {isPlaceModalOpened && (
        <PharmBoxInfo currentData={currentData} openModal={setIsPlaceModalOpened} />
      )}
    </main>
  )
}
