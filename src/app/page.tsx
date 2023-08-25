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
  lng: string
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
            lng: place.lng
          });
        });

        setDataList(data);
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
            <p className="rounded-xl shadow-lg p-2 my-2">기준일: {registeredDate}</p>
            <ul className="rounded-xl overflow-y-scroll w-full md:w-96 h-min">
            {dataList.length > 0 ? dataList.map((place) => (
              <li key={place.location} className="rounded-xl shadow-lg p-4 my-4 mx-2">
                <span className="font-semibold block">{place.name}</span>
                <span className="block">{place.location}</span>
                <span className="block">{place.tel}</span>
              </li>
            )) : (
              <p>데이터가 없습니다.</p>
            )}
            </ul>
          </>
        )}
      </section>
      <Kmap latLng={latLng} data={dataList} />
    </main>
  )
}
