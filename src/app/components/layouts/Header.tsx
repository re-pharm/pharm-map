import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CurrentLocationButton from "../locations/CurrentLocationButton";

type Props = {
    isInfoPage?: boolean
}

/*
    menu icon: faEllipsis
    dashboard icon: faChartLine
    help icon: faCircleQuestion
    contributors icon: faCodeCompare
    inquiry icon: faPaperPlane
    bookmark icon: faBookmark
*/

export default function Header(props: Props) {
    const inquiryLink = "https://forms.gle/EST5vaZBFGy8DHGE8";

    return (
        <header>
            <h1 className="text-2xl mb-1">
                <a href="/" className="no-underline">
                    <span className="block text-sm">우리동네</span>
                    폐의약품 수거지도 💊
                </a>
            </h1>
            <nav id="mainFunctions" className="flex gap-2">
                {props.isInfoPage ? "" : (<CurrentLocationButton />)}
                <a href={inquiryLink} target="_blank"
                    className="plain-btn-link">
                    <span className="pe-1">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </span>
                    문의/제보
                </a>
            </nav>
        </header>
    );
}