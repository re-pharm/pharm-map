import "./layout.css";
import Kmap from "../components/kakaomap/Kmap";
import Location from "../components/locations/Location";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function mainLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex h-full">
            <section id="search" className="w-full sm:w-fit px-8 pt-8 flex flex-col h-[calc(100vh-4rem)]">
                <h1 className="text-2xl">
                    <a href="/" className="no-underline">
                        <span className="blockText text-sm">우리동네</span>
                        폐의약품 수거지도 💊
                    </a>
                </h1>
                <Location />                
                {children}
            </section>
            <Kmap latLng={{
                lat: 33.450701,
                lng: 126.570667
            }} />
        </main>
    )
}