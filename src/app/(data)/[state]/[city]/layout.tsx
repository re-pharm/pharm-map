import type { Metadata } from 'next';
import { metadata } from '@/app/layout';

type Params = {
    params: Promise<{
        state: string,
        city: string
    }>,
    searchParams: Promise<{
        id?: string
    }> | undefined,
    children: React.ReactNode,
    dialog: React.ReactNode
}

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const searchParams = await props.searchParams;

    if (searchParams && searchParams.id) {
        const boxReq = await fetch(`${process.env.SERVICE_URL
        }/api/data?state=${params.state}&city=${params.city
        }&id=${searchParams.id}`);
        const boxData = boxReq.ok ? await boxReq.json() : undefined;
        const address = boxData ? boxData.address.split(" ") : undefined;
        
        if (address) {
            return {
                title: `${boxData.name} | ${address[0]} ${params.state === "sj" ? "":address[1]} | 폐의약품 수거지도`,
                description: 
                    `${address[0]} ${params.state === "sj" ? "":address[1]} ${boxData.name}의 수거함 정보를 확인하세요.`,
                openGraph: {
                    type: "website",
                    url: "https://pharm.paperbox.pe.kr",
                    title: `${boxData.name} | ${address[0]} ${params.state === "sj" ? "":address[1]} 폐의약품 수거함`,
                    description:
                        `상세 정보 확인하기`
                }
            }
        }
    }

    const validateResult = await fetch(`${process.env.SERVICE_URL
        }/api/geo/supported?type=single&state=${
        params.state}&city=${params.city}`).then((res) => res.json());

    if (validateResult.state.name) {
        return {
            title: `${validateResult.state.name} ${validateResult.city.name} | 폐의약품 수거지도`,
            description: `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함 위치를 확인하세요.`,
            openGraph: {
                type: "website",
                url: "https://pharm.paperbox.pe.kr",
                title: `${validateResult.state.name} ${validateResult.city.name} 폐의약품 수거지도`,
                description: `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함 위치를 확인하세요`
            }
        }
    } else {
        return metadata;
    }
}

export default function ResultLayout(props: Params) {
    return (
        <>
            {props.children}
            {props.dialog}
        </>
    )
}

export const runtime = 'edge';