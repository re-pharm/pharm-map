import { Data, organizationIcons, organizationType } from "@/app/types/listdata"; //데이터 타입
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Props = {
    state: string,
    city: string,
    data: Data[]
}

export default function DataList(props: Props) {

    return(
        <section id="dataList" className="flex items-center justify-center max-h-full flex-col shrink rounded-md overflow-hidden">
            <ul className="overflow-y-scroll w-full flex flex-col gap-4 p-2">
            {props.data.map((place) => (
                <li key={place.location}>
                    <Link href={`/${props.state}/${props.city}/box?name=${place.name}`}
                        className="block p-4 rounded-xl shadow-lg basis-0 shrink w-full text-start no-underline dark:bg-slate-700">
                        <span className="block">
                            <span className="inline-block rounded-xl dark:bg-slate-800 bg-slate-200 py-1 px-2 me-2">
                                <FontAwesomeIcon 
                                    icon={organizationIcons[place.type]}
                                    className="pe-1" />
                                {organizationType[place.type]}
                            </span>
                            <span className="text-lg font-semibold inline-block">{place.name}</span>
                            {place.distance ? (
                                <span className="inline-block ms-2">{place.distance.toFixed(2)}km</span>
                            ):""}
                        </span>
                        <span className="block">{place.location}</span>
                        <span className="block">{place.tel}</span>
                    </Link>
                </li>
            ))}
            </ul>       
        </section>
    )
}