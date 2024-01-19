import { faChartLine, faCodeCompare, faEllipsis, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CurrentLocationButton from "../locations/CurrentLocationButton";
import Link from "next/link";
import Menu from "./Menu";

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

export const links = {
    inquiry: "https://forms.gle/EST5vaZBFGy8DHGE8",
    contributors: "https://github.com/re-pharm/pharm-map/graphs/contributors",
    dashboard: "/dashboard"
}

export default function Header(props: Props) {
    
    return (
        <header>
            <h1 className="text-2xl mb-1">
                <a href="/" className="no-underline">
                    <span className="block text-sm">우리동네</span>
                    폐의약품 수거지도 💊
                </a>
            </h1>
            <nav id="mainFunctions" className="flex justify-between">
                <div className="flex gap-2">
                    {props.isInfoPage ? "" : (<CurrentLocationButton />)}
                    <a href={links.inquiry} target="_blank"
                        className="plain-btn-link hidden m_menu:inline">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </span>
                        문의/제보
                    </a>
                    <Link href={links.dashboard}
                        target="_blank" className="plain-btn-link hidden m_menu:inline md:hidden">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faChartLine} />
                        </span>
                        현황판
                    </Link>
                    <a href={links.contributors}
                        target="_blank" className="plain-btn-link hidden m_menu:inline md:hidden">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faCodeCompare} />
                        </span>
                        기여자
                    </a>
                </div>
                <Menu />
            </nav>
        </header>
    );
}