import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";
import type { Data } from "@/app/types/listdata";
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
        <dialog open 
            className="shadow-lg rounded-xl p-4 max-w-[calc(100%-1rem)] z-50 inset-y-1/3 inset-1/2 dark:text-white block">
            <PharmBoxInfo currentData={filterResult[0]} /> 
        </dialog>
    ); 
}