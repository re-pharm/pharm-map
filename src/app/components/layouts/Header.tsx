import "./header.css";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CurrentLocationButton from "../locations/CurrentLocationButton";

type Props = {
    isInfoPage?: boolean
}

export default function Header(props: Props) {
    return (
        <header>
            <h1 className="text-2xl mb-1">
                <a href="/" className="no-underline">
                    <span className="blockText text-sm">우리동네</span>
                    폐의약품 수거지도 💊
                </a>
            </h1>
            <nav id="mainFunctions" className="flex gap-2">
                {props.isInfoPage ? "" : (<CurrentLocationButton />)}
                <a href="https://forms.gle/EST5vaZBFGy8DHGE8" target="_blank"
                    className="border-b-2 border-slate-300 dark:border-slate-400 hover:bg-slate-100
                        hover:dark:bg-slate-600 dark:bg-slate-800 rounded-sm p-2 no-underline">
                    <FontAwesomeIcon icon={faPaperPlane} className="pe-1" />
                    문의/제보
                </a>
            </nav>
        </header>
    );
}