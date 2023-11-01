import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";
import Dialog from "@/app/components/layouts/Dialog";
import type { Data } from "@/app/types/listdata";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

type Params = { 
    params: {
        state: string,
        city: string,
    },
    searchParams: {
        name: string
    }
}

export default async function PharmBoxInfoDialog({ params, searchParams }: Params) {
    const boxList = await fetch(`${process.env.SERVICE_URL}/api/service/${params.state}/${params.city}`)
            .then(async(result) => await result.json());

    const filterResult = 
        boxList.data.filter((place:Data) => place.name === searchParams.name);

    return (
        <Dialog>
            <PharmBoxInfo currentData={filterResult[0]} /> 
        </Dialog>
    ); 
}