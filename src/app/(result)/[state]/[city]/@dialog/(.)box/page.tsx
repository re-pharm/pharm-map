import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";
import Dialog from "@/app/components/layouts/Dialog";
import { metadata } from "@/app/layout";
import { Metadata } from "next";

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
    const validateResult = await fetch(`${process.env.SERVICE_URL
        }/api/service/supported_region?type=single&state=${
        params.state}&city=${params.city}`).then((res) => res.json());
    const validData = await fetch(`${process.env.SERVICE_URL
        }/api/service/supported_region?type=current&state=${
        params.state}&city=${params.city}`).then((res) => res.json());
    const boxData = await fetch(`${process.env.SERVICE_URL
        }/api/service/data?state=${params.state}&city=${params.city
        }&integrated=${validData.integrated}&id=${searchParams.id}`)
        .then(async(result) => await result.json());
    
    if (validateResult.state.name) {
        return {
            title: `${boxData.name} | ${validateResult.state.name} ${validateResult.city.name} | 폐의약품 수거지도`,
            description: 
                `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함이 위치한 ${boxData.name}의 정보를 확인하세요.`,
            openGraph: {
                type: "website",
                url: "https://pharm.paperbox.pe.kr",
                title: `${boxData.name} | ${validateResult.state.name} ${validateResult.city.name} 폐의약품 수거함`,
                description:
                    `상세 정보 확인하기`
            }
        }
    } else {
        return metadata;
    }
}

export default async function PharmBoxInfoDialog({ params, searchParams }: Params) {
    const validData = await fetch(`${process.env.SERVICE_URL
        }/api/service/supported_region?type=current&state=${
        params.state}&city=${params.city}`).then((res) => res.json());
    const boxData = await fetch(`${process.env.SERVICE_URL
        }/api/service/data?state=${params.state}&city=${params.city
        }&integrated=${validData.integrated}&id=${searchParams.id}`)
        .then(async(result) => await result.json());
   
    return (
        <Dialog state={params.state} city={params.city} name="수거함 정보">
            <PharmBoxInfo currentData={boxData} /> 
        </Dialog>
    ); 
}

export const runtime = 'edge';