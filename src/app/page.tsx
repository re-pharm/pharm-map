import "./page.css";
import { ManualLocation } from "./components/locations/ManualLocation";
import { faArrowUpWideShort, faCalendarCheck, faInfoCircle, faMap, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CurrentLocationButton from "./components/locations/CurrentLocationButton";


// 사용자 선택 전 대체 UI
export default function Home() {

    return(
        <>
            <div id="mainData" className="w-full sm:w-fit px-8 pt-8 flex flex-col h-[calc(100vh-4rem)]">
                <header>
                    <h1 className="text-2xl">
                        <a href="/" className="no-underline">
                            <span className="blockText text-sm">우리동네</span>
                            폐의약품 수거지도 💊
                        </a>
                    </h1>
                    <nav id="mainFunctions" className="flex gap-2">
                        <CurrentLocationButton />
                        <a href="https://forms.gle/EST5vaZBFGy8DHGE8" target="_blank"
                            className="hover:bg-slate-100 hover:dark:bg-slate-600 dark:bg-slate-800 rounded-xl p-2 no-underline">
                            <FontAwesomeIcon icon={faPaperPlane} className="pe-1" />
                            문의/제보
                        </a>                
                    </nav>
                </header>
                <main className="h-full flex flex-col">
                    <ManualLocation />
                    <form name="resultData">
                        <input type="text" inputMode="text" placeholder="장소명 혹은 주소로 검색하세요"
                        className="border-solid focus:border-teal-400 focus:ring-teal-400 rounded-sm pl-2 w-full"
                        />
                    </form>
                    <section id="info" className="flex my-2 gap-2">
                    <p className="rounded-xl shadow-md p-2">
                        <FontAwesomeIcon icon={faCalendarCheck} className="px-1" />
                        <span className="font-semibold pe-2">기준일</span>
                        -
                    </p>
                    <p className="rounded-xl shadow-md p-2">
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="px-1" />
                        <span className="font-semibold pe-2">정렬 방법</span>
                        기본 순
                    </p>
                    </section>
                    <section id="dataList" className="flex items-center h-full justify-center flex-col rounded-md shadow-lg">
                        <FontAwesomeIcon icon={faInfoCircle} className="block" />
                        <p className="text-center m-4">
                            &apos;현위치&apos;를 눌러 확인하시거나,
                            <br />
                            시/도 및 시/군/구를 선택하세요.
                        </p>
                    </section>
                </main>
            </div>
            <div id="mapDummy"
                className="w-full hidden md:me-8 md:mt-8 md:flex md:flex-col
                    shadow-lg rounded-xl justify-center">
                <FontAwesomeIcon icon={faMap} className="block" />
                <p className="text-center m-4">
                    &apos;현위치&apos;를 눌러 확인하시거나,
                    <br />
                    시/도 및 시/군/구를 선택하세요.
                </p>
            </div>
        </>
    )
}