'use client'

import Script from 'next/script';
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Data } from '@/app/types/listdata';
import { RegionData } from '@/app/types/listDataWithContext';

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

    useEffect(() => {
        if (map) {
            map.setCenter(new (window as any).kakao.maps.LatLng(
                prop.latLng.lat, prop.latLng.lng
            ));
        }
    }, [prop.latLng, map]);

    // 맵에 수거함 위치 설정
    useEffect(() => {
        function loadPharmBoxInfo(state: string, city: string, id: string) {
            router.push(`/${state}/${city}/box?id=${id}`);
        }

        if (map && prop.data && prop.data.length > 0) {
            prop.data.forEach((place) => {
                const marker = new (window as any).kakao.maps.Marker({
                    map: map,
                    position: new (window as any).kakao.maps.LatLng(place.lat, place.lng)
                });

                const info = new (window as any).kakao.maps.CustomOverlay({
                    content: `
                        <div class="w-full relative bottom-16 rounded-xl bg-white dark:bg-black shadow-lg">
                            <p class="text-center font-semibold text-base px-4 py-2">${place.name}</p>
                        </div>
                    `,
                    map: map,
                    position: marker.getPosition()
                });
                info.setMap(null);

                if (regionCode) {
                    const state = regionCode.state;
                    const city = regionCode.city;
            
                    (window as any).kakao.maps.event.addListener(marker, "click", function() {
                        loadPharmBoxInfo(state, city, place.id);
                        map.setCenter(new (window as any).kakao.maps.LatLng(
                            place.lat, place.lng
                        ));
                    });
                }

                (window as any).kakao.maps.event.addListener(marker, "mouseover", function() {
                    info.setMap(map);
                });

                (window as any).kakao.maps.event.addListener(marker, "mouseout", function() {
                    info.setMap(null);
                });
            });
        }
    }, [prop.data, map, router, regionCode]);

    return (
        <>
        <Script src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
            onReady={() => {
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
                })}}/>
            <section ref={mapContainer} className="rounded-xl w-full hidden md:block">
            </section>
        </>
    )
}
