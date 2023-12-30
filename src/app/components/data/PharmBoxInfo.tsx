import { faRoute, faPhone, faLocationDot, faClock, faCheckDouble, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Data, organizationIcons, organizationType } from "@/app/types/listdata";

type Props = {
    currentData: Data | undefined,
}

type OperationData = {
    start: number,
    end: number
}

const operationDays = ["월", "화", "수", "목", "금", "토", "일", "공휴일"];

export default async function PharmBoxInfo(prop: Props) {
    const data = prop.currentData;
    const operationArray: OperationData[] = [];

    if (data && data.type === "pharm") {
        const state = data.location.split(" ")[0];
        const city = data.location.split(" ")[1];
        const name = data.name.replace(/\s+/g, '');
        const operationData =
            await fetch(`${process.env.SERVICE_URL}/api/service/pharm/info?state=${state}&city=${city}&name=${name}`);
        const operationJson = await operationData.json();

        if (operationData.ok) {
            for (let i = 1; i < 9; i++) {
                if(operationJson.data[`dutyTime${i}s`]) {
                    operationArray.push({
                        start: operationJson.data[`dutyTime${i}s`],
                        end: operationJson.data[`dutyTime${i}c`]
                    });    
                }
            }
        }
    }

    if (data) {
        return (
            <div>
                {/* 수거함 종류 및 이름 */}
                <h2 className="text-3xl font-semibold flex">
                    <span className="w-max text-xl rounded-sm dark:bg-slate-900 bg-slate-200 py-1 px-2 mb-1 me-2">
                        <FontAwesomeIcon 
                        icon={organizationIcons[data.type]}
                        className="pe-1" />
                        {organizationType[data.type]}
                    </span>
                    <span className="md:w-auto lg:w-max w-max md:break-all lg:break-keep">
                        {data.name}
                    </span>
                </h2>
    
                {/* 수거함 위치 및 연락처로 연결되는 버튼 모음 */}
                <ul className="flex gap-2 w-max my-4">
                    <li>
                        <a 
                            href={`https://map.kakao.com/link/to/${data.name},${data.lat},${data.lng}`}
                            target="_blank"
                            className="no-underline px-2 pt-2 pb-1.5 mt-1 border-b-2 border-slate-300 dark:border-slate-400
                                hover:bg-slate-100 hover:dark:bg-slate-600 rounded-sm"
                        >
                            <FontAwesomeIcon icon={faRoute} className="pe-1" />
                            <span className="font-semibold">길찾기</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href={`tel:${data.tel}`}
                            className="no-underline px-2 pt-2 pb-1.5 mt-1 border-b-2 border-slate-300 dark:border-slate-400
                            hover:bg-slate-100 hover:dark:bg-slate-600 rounded-sm"
                        >
                            <FontAwesomeIcon icon={faPhone} className="pe-1" />
                            <span className="font-semibold">전화하기</span> {data.tel}
                        </a>
                    </li>
                </ul>
                
                {/* 수거함 주소 */}
                <p id="location" className="flex">
                    <FontAwesomeIcon icon={faLocationDot} className="pe-2 mt-1" />
                    <span>{data.location}</span>
                </p>
    
                {/* 수거함 소재지의 운영 시간 */}
                {operationArray.length > 0 && (
                    <section id="operationHours" className="flex mt-2">
                        <FontAwesomeIcon icon={faClock} className="pe-2 mt-1" />
                        <ul>
                            {operationArray.map((data: OperationData, index) => (
                                <li key={index}>
                                    <span className="font-semibold pe-2">{operationDays[index]}</span>
                                    {data.start >= 1000 ? 
                                        `${data.start.toString().slice(0, 2)}:${data.start.toString().slice(2)}`
                                        : `${data.start.toString().slice(0, 1)}:${data.start.toString().slice(1)}`}
                                    &nbsp;~&nbsp;
                                    {data.end >= 1000 ? 
                                        `${data.end.toString().slice(0, 2)}:${data.end.toString().slice(2)}`
                                        : `${data.end.toString().slice(0, 1)}:${data.end.toString().slice(1)}`}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
    
                {/* 수거함 정보 출처 */}
                <section id="dataSource" className="flex gap-2 mt-2">
                    <div className="flex items-start">
                        <FontAwesomeIcon icon={faCheckDouble} className="me-2 mt-1" />
                        <span className="font-semibold">출처</span>
                    </div>
                    <ul>
                        <li>
                            {`${data.location.split(" ")[0].endsWith("도") ? 
                                data.location.split(" ")[1]
                                :data.location.split(" ")[0]} 폐의약품 수거함 공공데이터`}
                        </li>
                        {operationArray.length > 0 ? (
                            <li>
                                <a href="https://www.nmc.or.kr/nmc/main/contents.do?menuNo=200553" target="blank">
                                    국립중앙의료원 약국 정보 공공데이터
                                </a>
                            </li>
                        )
                        : ""}
                    </ul>
                </section>
    
                {/* 수거함 데이터 관련 주의사항 */}
                <section id="caution" className="flex gap-2 mt-2">
                    <div className="flex items-start">
                        <FontAwesomeIcon icon={faInfoCircle} className="me-2 mt-1" />
                        <span className="font-semibold">안내</span>
                    </div>
                    <p>
                        공공 데이터 자료는 특성상 기준일 이후 전화번호, 운영 시간 등이 변경될 수 있으므로,&nbsp;
                        <a href={`https://map.kakao.com/link/search/${data.name}`} target="_blank">카카오맵</a>
                        &nbsp;혹은&nbsp;
                        <a href={`https://map.naver.com/p/search/${data.name}`} target="_blank">네이버 지도</a>
                        에서 장소를 찾아보시거나 직접 전화하시어 다시 한 번 확인하세요.
                    </p>
                </section>
            </div>
        )
    }
}