import { faArrowUpWideShort, faBuildingColumns, faCalendarCheck, faCapsules, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

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

//현위치 기능 사용 시 거리 재기
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


// To-Do 검색 기능 복구
//
// function search() {
//        const initialSound = new RegExp("[ㄱ-ㅎ|ㅏ-ㅣ]");
//     const searchKeyword = pharmName.current ? pharmName.current.value : "";
//     if (!initialSound.test(searchKeyword)) {
//       setVisibleData(dataList.filter((data) => 
//         data.name.includes(searchKeyword) || data.location.includes(searchKeyword)));
//     }
//   }

export default async function Page({ params, searchParams }: { 
    params: {
        state: string,
        city: string
        keyword?: string
    },
    searchParams: {
        lat?: string,
        lng?: string
    }
}) {
    //데이터 불러오기
    const regionData = await import(`../../../api/service/${params.state}/${params.city}/route`);
    const regionJson = await regionData.getPharmBoxList();

    const data: Data[] = [];
    const isGeolocationEnabled = (searchParams.lat && searchParams.lng);

    if (regionJson[1].status === 200) {
        regionJson[0].data.forEach((place:Data) => {
            data.push({
                name: place.name,
                location: place.location,
                tel: place.tel,
                lat: place.lat,
                lng: place.lng,
                type: place.type,
                distance: getDistanceKm(
                    {lat: Number(searchParams.lat), lng: Number(searchParams.lng)}, 
                    {lat: place.lat, lng: place.lng}
                )
            });
        });
    };

    if(isGeolocationEnabled) {
        data.sort((a, b) => a.distance - b.distance);
    }

    const organizationType : OrganizationType = {
        pharm: "약국",
        public: "공공기관"
    }

    return(
        <>
            <form name="resultData">
                <input type="text" inputMode="text" placeholder="장소명 혹은 주소로 검색하세요"
                className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
                />
            </form>
            <section id="info" className="flex my-2 gap-2">
              <p className="rounded-xl shadow-lg p-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
                <span className="font-semibold pe-2">기준일</span>
                -
              </p>
              <p className="rounded-xl shadow-lg p-2">
                <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
                <span className="font-semibold pe-2">정렬 방법</span>
                기본 순
              </p>
            </section>
            <section id="dataList" className="flex items-center justify-center h-full flex-col rounded-md overflow-hidden">
                <ul className="overflow-y-scroll w-full flex flex-col gap-4 p-2">
                {data.map((place) => (
                    <li key={place.location}>
                        <Link href={`/${params.state}/${params.city}/${place.name}`}
                            className="block p-4 rounded-xl shadow-lg basis-0 shrink w-full text-start no-underline dark:bg-slate-700">
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
                        </Link>
                    </li>
                ))}
                </ul>       
            </section>
        </>
    )
}