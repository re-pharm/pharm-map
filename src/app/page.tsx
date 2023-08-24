"use client"
import './page.css'
import { useEffect, useState } from 'react';
import Kmap from './Kmap';
import Location from './Location';

type Data = {
  name: string,
  location: string,
  tel: string
}

export default function Home() {
  const [latLng, setLatLng] = useState({lat: 33.450701, lng: 126.570667});
  const [region, setRegion] = useState<{state: string|null, city: string|null}>({state: null, city: null});
  const [dataList, setDataList] = useState<Data[]>([]);
  const [isDataError, setIsDataError] = useState(false);

  useEffect(() => {
    async function getRegionData() {
      const regionData = await fetch(`/api/service/${region.state}/${region.city}`);
      const regionJson = await regionData.json();
      const data: Data[] = [];

      if (regionData.ok) {
        regionJson.data.forEach((place: {[index: string]: string}) => {
          data.push({
            name: place[regionJson.structure.name],
            location: place[regionJson.structure.location],
            tel: place[regionJson.structure.tel]
          });
        });

        setDataList(data);
      } else {
        setIsDataError(true);
      }
    }

    console.log(region);

    if (region.state !== null) {
      getRegionData();
    }
  }, [region]);

  return (
    <main className="flex">
      <section id="search" className="w-full sm:w-fit px-8 pt-8">
        <h1 className="text-2xl">
          <span className="blockText text-sm">우리동네</span>
          폐의약품 수거지도 💊
        </h1>
        <Location setLatLng={setLatLng} setRegion={setRegion} />
        <form name="resultData">
          <input type="text" inputMode="text" id="pharm" placeholder="장소명을 검색하세요"
            className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2"
          />
        </form>
        <ul>
          {dataList.length > 0 && dataList.map((place) => (
            <li key={place.location}>{place.name}</li>
          ))}
        </ul>
      </section>
      <Kmap latLng={latLng} />
    </main>
  )
}
