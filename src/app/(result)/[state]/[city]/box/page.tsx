import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import PharmBoxInfo from '@/app/components/data/PharmBoxInfo';
import { Data } from '@/app/types/listdata';
import Kmap from '@/app/components/kakaomap/Kmap';

type Props = {
    params: {
        state: string,
        city: string
    }

    searchParams: {
        name: string
    }
}

export async function generateMetadata(
    {params, searchParams}: Props
): Promise<Metadata> {
    const validateResult = await fetch(`${process.env.SERVICE_URL
        }/api/service/supported_region?type=single&state=${
        params.state}&city=${params.city}`).then((res) => res.json());
    
    if (validateResult.state.name) {
        return {
            title: `${searchParams.name} | ${validateResult.state.name} ${validateResult.city.name} | 폐의약품 수거지도`,
            description: 
                `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함이 위치한 ${searchParams.name}의 정보를 확인하세요.`,
            openGraph: {
                type: "website",
                url: "https://pharm.paperbox.pe.kr",
                title: `${searchParams.name} | ${validateResult.state.name} ${validateResult.city.name} 폐의약품 수거지도`,
                description:
                    `${validateResult.state.name} ${validateResult.city.name}의 폐의약품 수거함이 위치한 ${searchParams.name}의 정보를 확인하세요.`
            }
        }
    } else {
        return metadata;
    }
}

export default async function PharmBoxInfoPage({params, searchParams}: Props) {
    const validData =
                    await fetch(`${process.env.SERVICE_URL
                        }/api/service/supported_region?type=current&state=${
                        params.state}&city=${params.city}`).then((res) => res.json());
    const boxData = await fetch(`${process.env.SERVICE_URL
            }/api/service/data?state=${params.state}&city=${params.city}&name=${searchParams.name
            }&integrated=${validData.integrated}`).then(async(result) => await result.json());

    return(
        <section id="info" className="flex shadow-lg p-4 rounded-2xl">
            <PharmBoxInfo currentData={boxData} />
            <Kmap latLng={{
                lat: Number(boxData.lat),
                lng: Number(boxData.lng)
            }} data={[boxData]} />
        </section>
    );
}

export const runtime = 'edge';