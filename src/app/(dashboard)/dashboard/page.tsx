import IssueList from "@/app/components/data/IssueList";
import Header from "@/app/components/layouts/Header";
import { faCodeCommit, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function Dashboard() {
    const openIssues = 
        await fetch("https://api.github.com/repos/re-pharm/pharm-map/issues")
        .then((res) => res.json());
    const closedIssues =
        await fetch("https://api.github.com/repos/re-pharm/pharm-map/issues?state=closed")
        .then((res) => res.json());

    return (
        <div className="flex-col flex w-full">
            <section className="flex gap-2 mb-4 flex-1">
                <Header isInfoPage={true} />
                <h1 className="text-lg md:text-2xl mt-[1.25rem]">
                    |&nbsp;제보 현황판
                </h1>
            </section>
            <section id="notice" className="mb-4 flex gap-2 shrink md:w-fit
                flex-col md:flex-row">
                <span className="bg-slate-50 dark:bg-slate-800
                rounded-2xl flex p-4 gap-2 items-center">
                    <FontAwesomeIcon icon={faCodeCommit} />
                    <span>현재 버전 {process.env.npm_package_version}</span>
                </span>
                <span className="bg-slate-50 dark:bg-slate-800
                rounded-2xl flex p-4 gap-2 items-center">
                    <FontAwesomeIcon icon={faLightbulb} />
                    Ctrl+F 혹은 페이지에서 찾기로 원하는 문제를 찾아보세요!
                </span>
            </section>
            <div className="flex flex-wrap w-full gap-4 md:gap-8">
                <IssueList data={openIssues} isOpen={true} />
                <IssueList data={closedIssues} isOpen={false} />
            </div>
       </div>
    )
}