"use client";
import { motion } from "motion/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode,
  state?: string,
  city?: string,
  name?: string,
  id?: string,
  fallback?: boolean
}

export default function Dialog(props:Props) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (dialog && dialog.current && (props.id || props.fallback)) {
      dialog.current.showModal();
      requestAnimationFrame(() => setVisible(true));
    }
  }, [dialog, props.id, props.fallback]);

  function closeModal() {
    // trigger exit animation, then close dialog and navigate after animation
    setVisible(false);
    setTimeout(() => {
      if (dialog && dialog.current && dialog.current.open) {
        dialog.current.close();
      }
      if(props.state && props.city) {
        router.push(`/${props.state}/${props.city}/list`, { scroll: false });
      } else {
        router.back();
      }
    }, 200);
  }

  return (
    <motion.dialog
      ref={dialog}
      onCancel={(e) => { e.preventDefault(); closeModal(); }}
      initial={{ opacity: 0, scale: 0.90, y: -10, x: -10 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0, x: 0 } : { opacity: 0, scale: 0.90, y: -10, x: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="shadow-lg rounded-xl p-4 max-w-[calc(100%-1rem)] w-full md:w-min z-50 
                md:inset-y-1/6 md:inset-x-1/2 mx-2 my-2 md:my-auto
                dark:text-white lg:backdrop:opacity-50 dark:backdrop:opacity-80">
      <section id="dialogButtons"
        className="flex text-xl w-full justify-between items-center mb-2">
        <p>{props.name ?? "안내"}</p>
        <button type="button" onClick={() => closeModal()}
          className="no-underline py-1 px-1 mb-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </section>
      { props.children }
    </motion.dialog>
  )
}