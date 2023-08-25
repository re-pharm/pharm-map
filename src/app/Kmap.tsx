'use client'

import Script from 'next/script';
import { useCallback, useEffect, useState } from 'react';
import "./kmap.css";

type Props = {
  latLng: {
    lat: Number,
    lng: Number
  },

  lat?: string,
  lng?: string,
  data: {
    name: string,
    lat: string,
    lng: string
  }[]
}

export default function Kmap(prop: Props) {
  const [map, generateMap] = useState<any>();

  const initMap = useCallback(() => {
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new (window as any).kakao.maps.LatLng(prop.latLng.lat, prop.latLng.lng), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };
    generateMap(new (window as any).kakao.maps.Map(container, options)); //지도 생성 및 객체 리턴
  }, [prop]);

  useEffect(() => {
    if (map) {
      map.setCenter(new (window as any).kakao.maps.LatLng(prop.latLng.lat, prop.latLng.lng));
    }
  }, [prop.latLng, map])

  useEffect(() => {
    if (map) {
      prop.data.forEach((place) => {
        const marker = new (window as any).kakao.maps.Marker({
          map: map,
          position: new (window as any).kakao.maps.LatLng(place.lat, place.lng),
          title: place.name
        })
      })
    }
  }, [prop.data, map])

  return (
    <>
      <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`}
          onLoad={() => (window as any).kakao.maps.load(initMap)}
      />
      <section id="map" className="rounded-xl w-full hidden md:me-8 md:mt-8 lg:block">
      </section>
    </>
  )
}
