"use client";
import Loading from "@/app/(data)/[state]/[city]/@dialog/(.)box/loading";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

type Props = {
    children: React.ReactNode,
    state?: string,
    city?: string,
    name?: string
}

export default function Dialog(props:Props) {
    const router = useRouter();
    const dialog = useRef<HTMLDialogElement>(null);
    const path = usePathname();

    useLayoutEffect(() => {
        if (dialog && dialog.current && path.includes("/box")) {
            dialog.current.showModal();
        }
    }, [dialog, path]);

    function closeModal() {
        if(props.state && props.city) {
            router.push(`/${props.state}/${props.city}/list`);
        } else {
            router.back();
        }
    }

    return (
        <dialog ref={dialog} onClose={(e) => closeModal()}
        className="shadow-lg rounded-xl p-4 max-w-[calc(100%-1rem)] w-full md:w-min z-50 
            md:inset-y-1/6 md:inset-x-1/2 mx-2 my-2 md:my-auto
            dark:text-white lg:backdrop:opacity-50 dark:backdrop:opacity-80">
            <section id="dialogButtons"
                className="flex text-xl w-full justify-between items-center mb-2">
                <p>{props.name ?? "안내"}</p>
                <form method="dialog">
                    <button
                        className="no-underline py-0 px-2 mb-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </form>
            </section>
            { props.children }
        </dialog>
    )
}