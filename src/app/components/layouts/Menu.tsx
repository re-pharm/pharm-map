"use client";
import { faEllipsis, faPaperPlane, faChartLine, faCodeCompare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { links } from "./Header";
import { MouseEvent, useRef } from "react";

export default function Menu() {
    const dialog = useRef<HTMLDialogElement>(null);

    function closeModal(e: MouseEvent<HTMLDialogElement>) {
        if (e.target instanceof HTMLDialogElement) {
            e.target.close();
        }
    }

    return (
        <>
        <button className="plain-btn m_menu:hidden md:block" onClick={
            (e) => dialog.current ? dialog.current.showModal():""}>
            <span className="pe-1.5">
                <FontAwesomeIcon icon={faEllipsis} />
            </span>
            더 보기
        </button>
        <dialog ref={dialog} className="z-50 rounded-xl shadow-lg bg-slate-50 dark:bg-slate-800
            mt-[7.5rem] md:mt-[8.5rem] md:ms-96 md:me-auto me-4"
            onClick={(e) => closeModal(e)}>
            <ul className="w-max flex flex-col gap-2 p-4">
                <li className="block sm:hidden">
                    <a href={links.inquiry} target="_blank"
                        className="menu-item">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </span>
                        문의/제보
                    </a>
                </li>
                <li>
                    <Link href={links.dashboard}
                        target="_blank" className="menu-item">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faChartLine} />
                        </span>
                        현황판
                    </Link>
                </li>
                <li>
                    <a href={links.contributors}
                        target="_blank" className="menu-item">
                        <span className="pe-1">
                            <FontAwesomeIcon icon={faCodeCompare} />
                        </span>
                        기여자
                    </a>
                </li>
            </ul>
        </dialog>
        </>
    );
}