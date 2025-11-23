"use client"
import { faPills } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react"
import { Ref } from "react";

type Props = {
  ref: Ref<SVGSVGElement>
}

const pillIcon = (props: Props) => {
  return <FontAwesomeIcon icon={faPills} ref={props.ref} size="2x" />
}

export const LoadingIcon = motion.create(pillIcon);