import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";
import Dialog from "@/app/components/layouts/Dialog";
import { metadata } from "@/app/layout";
import { Metadata } from "next";
import { boxInfoMetaData } from "../../box/page";

type Params = { 
    params: {
        state: string,
        city: string,
    },
    searchParams: {
        id: string
    }
}

export async function generateMetadata(
    {params, searchParams}: Params
): Promise<Metadata> {
    const boxData = await fetch(`${process.env.SERVICE_URL
        }/api/service/data?state=${params.state}&city=${params.city}&id=${searchParams.id}`)
        .then(async(result) => await result.json());
    
    if (boxData.name) {
        return boxInfoMetaData(params.state, boxData);
    } else {
        return metadata;
    }
}

export default async function PharmBoxInfoDialog({ params, searchParams }: Params) {
    const boxData = await fetch(`${process.env.SERVICE_URL
    }/api/data?state=${params.state}&city=${params.city}&id=${searchParams.id}`)
    .then(async(result) => await result.json());
   
    return (
        <Dialog state={params.state} city={params.city} name="수거함 정보">
            <PharmBoxInfo currentData={boxData} /> 
        </Dialog>
    ); 
}

export const runtime = 'edge';