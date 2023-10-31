'use client'

import Script from 'next/script';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import "./kmap.css";
import { useRouter } from 'next/navigation';
import { RegionData, type Data } from '@/app/types/listdata';

type Props = {
  latLng: {
    lat: Number,
    lng: Number
  },

  data?: Data[],
}

export default function Kmap(prop: Props) {
  const router = useRouter();
  const mapContainer = useRef(null);
  const regionCode = useContext(RegionData);
  const [map, generateMap] = useState<any>(undefined);

  //맵 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).kakao.maps.load(() => {
        //지도 생성 및 객체 리턴
        const container = mapContainer.current; //지도를 담을 영역의 DOM 레퍼런스
        const options = { //지도를 생성할 때 필요한 기본 옵션
          center: new (window as any).kakao.maps.LatLng(
            prop.latLng.lat, 
            prop.latLng.lng
          ), //지도의 중심좌표.
          level: 3 //지도의 레벨(확대, 축소 정도)
        };
        generateMap(new (window as any).kakao.maps.Map(container, options));
      });
    }
  }, [prop.latLng, mapContainer]);

  useEffect(() => {
    if (map) {
      map.setCenter(new (window as any).kakao.maps.LatLng(
        prop.latLng.lat, prop.latLng.lng
      ));
    }
  }, [prop.latLng, map]);

  // 맵에 수거함 위치 설정
  useEffect(() => {
    function loadPharmBoxInfo(title: string, state: string, city: string) {
      router.push(`/${state}/${city}/${title}`);
    }

    if (map && prop.data && prop.data.length > 0 && regionCode) {
      const state = regionCode.state;
      const city = regionCode.city;

      prop.data.forEach((place) => {
        const marker = new (window as any).kakao.maps.Marker({
          map: map,
          position: new (window as any).kakao.maps.LatLng(place.lat, place.lng)
        });

        const infoWindow = new (window as any).kakao.maps.InfoWindow({
          content: `
            <div class="w-full me-8">
              <p class="text-center px-8">${place.name}</p>
            </div>
          `
        });

        (window as any).kakao.maps.event.addListener(marker, "click", function() {
          loadPharmBoxInfo(place.name, state, city);
        });

        (window as any).kakao.maps.event.addListener(marker, "mouseover", function() {
          infoWindow.open(map, marker);
        });

        (window as any).kakao.maps.event.addListener(marker, "mouseout", function() {
          infoWindow.close();
        });
      });
    }
  }, [prop.data, map, router, regionCode]);

  return (
    <>
      <section ref={mapContainer} className="rounded-xl w-full hidden md:me-8 md:mt-8 md:block">
      </section>
    </>
  )
}
