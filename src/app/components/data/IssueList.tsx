import { faClock, faFlag, faPenToSquare, faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IssueItem = {
    html_url: string,
    number: number,
    state: string,
    title: string,
    body: string,
    labels: {
        "name": string,
        "color": string
    }[],
    milestone: {
        "title": string
    }
    created_at: string,
    updated_at: string
}

type Props = {
    data: IssueItem[],
    isOpen: boolean
}

type Assets = {
    [index:string]:string
}

const color:Assets = {
    open: "text-green-500",
    closed: "text-violet-700",
    merged: "text-violet-700"
}

export default function IssueList(prop: Props) {
    return (
        <section className="flex-1">
            <h2 className="text-xl mb-2">
                {prop.isOpen ? "현재 진행 중인" : "완료된"} 작업
            </h2>
            <ul className="md:max-h-[67vh] md:overflow-y-scroll rounded-3xl
                ps-2 pe-6 py-1.5 bg-slate-100 dark:bg-slate-800">
            {prop.data.length > 0 ? prop.data.map((item:IssueItem) => (    
            <li key={item.number} className="shrink basis-0 w-full">
                <a href={item.html_url} target="_blank"
                    className="flex flex-col shadow-md rounded-2xl bg-white dark:bg-slate-600
                        gap-2 justify-center w-full min-w-0 p-4 m-2 no-underline">
                    <span className="flex gap-2">
                        <span className={color[item.state]}>
                            ●
                        </span>
                        <span className={`text-${color[item.state]}`}>
                            {item.title}
                        </span>
                    </span>
                    <span className="flex gap-4 text-sm flex-col md:flex-row
                        text-slate-500 dark:text-slate-300">
                        <span className="flex gap-1 items-center">
                            <FontAwesomeIcon icon={faTag} />
                            <span className="font-semibold">종류</span>
                            {item.labels.map((item) => (
                                <span key={item.name}>
                                    <span className="pe-1"
                                    style={{
                                        "color": `#${item.color}`
                                    }}>⦁</span>
                                    {item.name}
                                </span>
                            ))}
                        </span>
                        <span className="flex gap-1 items-center">
                            <FontAwesomeIcon icon={faClock} />
                            <span className="font-semibold">마지막 갱신</span>
                            <span>{item.updated_at.split("T")[0]}</span>
                        </span>
                        <span className="flex gap-1 items-center">
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span className="font-semibold">등록일</span>
                            <span>{item.created_at.split("T")[0]}</span>
                        </span>
                        {item.milestone ? (
                        <span className="flex gap-1 items-center">
                            <FontAwesomeIcon icon={faFlag} />
                            <span className="font-semibold">출시 목표</span>
                            <span>{item.milestone.title}</span>
                        </span>
                        ):""}
                    </span>
                </a>                    
            </li>
            )) : ""}
            </ul>
        </section>
    )
}