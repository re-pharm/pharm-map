import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import { validateLocationValue } from '@/app/functions/data/validateLocationData';

type Params = {
    params: {
        state: string,
        city: string
    },
    children: React.ReactNode,
    dialog: React.ReactNode
}

export async function generateMetadata(
    {params}: Params
): Promise<Metadata> {
    const validateResult = validateLocationValue(params.state, params.city);
    
    if (validateResult.valid) {
        return {
            title: `${validateResult.state} ${validateResult.city} | 폐의약품 수거지도`,
            description: `${validateResult.state} ${validateResult.city}의 폐의약품 수거함 위치를 확인하세요.`,
            openGraph: {
                type: "website",
                url: "https://pharm.paperbox.pe.kr",
                title: `${validateResult.state} ${validateResult.city} 폐의약품 수거지도`,
                description: `${validateResult.state} ${validateResult.city}의 폐의약품 수거함 위치를 확인하세요`
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