import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import PharmBoxInfo from '@/app/components/data/PharmBoxInfo';
import Header from "@/app/components/layouts/Header"
import Link from "next/link";
import Kmap from '@/app/components/kakaomap/Kmap';

type Props = {
    params: {
        state: string,
        city: string
    }

    searchParams: {
        name: string,
        id: string
    }
}

export async function generateMetadata(
    {params, searchParams}: Props
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

export default async function PharmBoxInfoPage({params, searchParams}: Props) {
    const validData =
            await fetch(`${process.env.SERVICE_URL
                }/api/service/supported_region?type=current&state=${
                params.state}&city=${params.city}`).then((res) => res.json());
    const boxData = await fetch(`${process.env.SERVICE_URL
            }/api/service/data?state=${params.state}&city=${params.city}&integrated=${validData.integrated
            }&id=${searchParams.id}`)
            .then(async(result) => await result.json());

    return(
        <div>
            <section id="regionAndHeader" className="flex gap-2 mb-4">
                <Header isInfoPage={true} />
                <p className="text-lg md:text-2xl mt-[1.25rem]">
                    |&nbsp;
                    <Link href={`/${params.state}/${params.city}`}
                        className="no-underline hover:after:content-['→'] focus:after:content-['→']" >
                        {validData.state.name} {validData.city.name}
                    </Link>
                    <span className="hidden md:inline">&nbsp;수거함 정보</span>
                </p>
            </section>
            <section id="info" className="flex shadow-lg p-4 rounded-2xl">
                <PharmBoxInfo currentData={boxData} />
                <Kmap latLng={{
                    lat: Number(boxData.lat),
                    lng: Number(boxData.lng)
                }} data={[boxData]} />
            </section>
        </div>
    );
}

export const runtime = 'edge';