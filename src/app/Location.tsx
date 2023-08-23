"use client"

export default function Location() {
  let lat = 33.450701;
  let lng = 126.570667;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        lat = coords.latitude;
        lng = coords.longitude;
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
    });
  }

  return (
    <form name="findLocation" className="mt-4 mb-2 flex flex-col gap-4">
        <div id="region" className="flex flex-row gap-2">
            <select id="state" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400">
              <option>시/도</option>
            </select>
            <select id="city" className="w-full rounded-sm focus:border-teal-400 focus:ring-teal-400">
              <option>시/군/구</option>
            </select>
        </div>
    </form>
  )
}
