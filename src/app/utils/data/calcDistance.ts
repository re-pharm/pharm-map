import type { Data } from "@/app/types/listdata";

//현위치 기능 사용 시 거리 재기
export function getDistanceKm(current: {lat: number, lng: number}, place: {lat: number, lng: number}) {
  const radLat1 = Math.PI * current.lat / 180;
  const radLat2 = Math.PI * place.lat / 180;
  const radTheta = Math.PI * (current.lng - place.lng) / 180;
  let distance = 
    Math.sin(radLat1) * Math.sin(radLat2) + 
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (distance > 1)
    distance = 1;

  return Math.acos(distance) * 180 / Math.PI * 60 * 1.1515 * 1.609344;
}

export function sortDistance(a: Data, b: Data) {
  if (a.distance && b.distance) {
    return a.distance - b.distance;
  }
  return 0;
}

export function insertDistanceInfo(data: Data[], lat: string, lng: string) {
  data.forEach((place:Data, idx: number) => {
    data[idx] = {
      ...place,
      distance: getDistanceKm({
        lat: Number(lat),
        lng: Number(lng)
      }, {
        lat: Number(place.lat),
        lng: Number(place.lng)
      })
    }
  });

  return data;
}