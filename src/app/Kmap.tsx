'use client'

import Script from 'next/script';
import { useCallback } from 'react';
import "./kmap.css";

export default function Kmap() {
  const initMap = useCallback(() => {
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
      center: new (window as any).kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };
    const map = new (window as any).kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
          const addressData = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.JSON?x=${coords.longitude}&y=${coords.latitude}`, {
              headers: {
                  "Authorization": `KakaoAK ${process.env.KAKAO_REST_KEY}`
              }
          });
          
          map.setCenter(new (window as any).kakao.maps.LatLng(coords.latitude, coords.longitude));
      }, (error) => {
          console.log(error);
      }, {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
      });
    }
  }, []);

  return (
    <>
      <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`}
          onLoad={() => (window as any).kakao.maps.load(initMap)}
      />
      <section id="map" className="mx-8 mt-8 rounded-xl w-full">
      </section>
    </>
  )
}
