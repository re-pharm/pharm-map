"use client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function Dialog({ children } : { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <dialog open
        className="shadow-lg rounded-xl p-4 max-w-[calc(100%-1rem)] z-50 inset-y-1/3 md:inset-1/2 dark:text-white">
            <section id="dialogButtons"
                className="flex text-xl w-full justify-between items-center mb-2 border-b-2">
                <p>수거함 정보</p>
                <button onClick={(e) => router.back()}
                    className="no-underline py-0 px-2 mb-1 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-xl">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </section>
            { children }
        </dialog>
    )
}