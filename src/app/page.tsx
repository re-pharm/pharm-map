"use client"
import './page.css'
import { useEffect, useState } from 'react';
import Kmap from './Kmap';
import Location from './Location';

type Data = {
  name: string,
  location: string,
  tel: string,
  lat: string,
  lng: string,
  distance: number
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
  const [region, setRegion] = useState<{state: string|null, city: string|null}>({state: null, city: null});
  const [registeredDate, setRegDate] = useState<string>("");
  const [dataList, setDataList] = useState<Data[]>([]);
  const [isDataError, setIsDataError] = useState(false);

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
            distance: getDistanceKm(
              {lat: latLng.lat, lng: latLng.lng}, 
              {lat: place.lat, lng: place.lng}
            )
          });
        });

        setDataList(data.sort((a, b) => a.distance - b.distance));
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
          <span className="blockText text-sm">우리동네</span>
          폐의약품 수거지도 💊
        </h1>
        <Location setLatLng={setLatLng} setRegion={setRegion} />
        <form name="resultData">
          <input type="text" inputMode="text" id="pharm" placeholder="장소명을 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
          />
        </form>
        {!isDataError && (
          <>
            <p className="rounded-xl shadow-lg p-2 my-2">기준일: {registeredDate ? registeredDate : "-"}</p>
            <ul className="rounded-xl overflow-y-scroll w-full md:w-96 h-min">
            {dataList.length > 0 ? dataList.map((place) => (
              <li key={place.location} className="rounded-xl shadow-lg p-4 my-4 mx-2">
                <span className="block">
                  <span className="font-semibold inline-block">{place.name}</span>
                  <span className="inline-block ms-2">{place.distance.toFixed(2)}km</span>
                </span>
                <span className="block">{place.location}</span>
                <span className="block">{place.tel}</span>
              </li>
            )) : (
              <p className="text-center m-4">데이터가 없습니다.</p>
            )}
            </ul>
          </>
        )}
      </section>
      <Kmap latLng={latLng} data={dataList} />
    </main>
  )
}
