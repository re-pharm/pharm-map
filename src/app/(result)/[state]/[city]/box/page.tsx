import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import { validateLocationValue } from '@/app/api/service/supported_region/route';
import PharmBoxInfo from '@/app/components/data/PharmBoxInfo';
import { Data } from '@/app/types/listdata';

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
    const validateResult = validateLocationValue(params.state, params.city);
    
    if (validateResult.valid) {
        return {
            title: `${searchParams.name} | ${validateResult.state} ${validateResult.city} | 폐의약품 수거지도`,
            description: 
                `${validateResult.state} ${validateResult.city}의 폐의약품 수거함 중 하나인 ${searchParams.name}의 정보를 확인하세요.`,
            openGraph: {
                type: "website",
                url: "https://pharm.paperbox.pe.kr",
                title: `${searchParams.name} | ${validateResult.state} ${validateResult.city} 폐의약품 수거지도`,
                description:
                    `${validateResult.state} ${validateResult.city}의 폐의약품 수거함 중 하나인 ${searchParams.name}의 정보를 확인하세요.`
            }
        }
    } else {
        return metadata;
    }
}

export default async function PharmBoxInfoPage({params, searchParams}: Props) {
    const boxList = await fetch(`${process.env.SERVICE_URL}/api/service/${params.state}/${params.city}`)
                    .then(async(result) => await result.json());

    const filterResult = 
        boxList.data.filter((place:Data) => place.name === searchParams.name);

    return(
        <section>
            <PharmBoxInfo currentData={filterResult[0]} /> 
        </section>
    );
}