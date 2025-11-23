import type { Metadata } from 'next';
import { metadata } from '@/app/layout';
import PharmBoxInfo from '@/app/components/data/PharmBoxInfo';
import Header from "@/app/components/layouts/Header"
import Link from "next/link";
import Kmap from '@/app/components/kakaomap/Kmap';
import { Data } from '@/app/types/listdata';
import { redirect } from 'next/navigation';

type Props = {
    params: Promise<{
        state: string,
        city: string
    }>

    searchParams: Promise<{
        name: string,
        id: string
    }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const boxData = await fetch(`${process.env.SERVICE_URL
        }/api/data?state=${params.state}&city=${params.city
        }&id=${searchParams.id}`)
        .then(async(result) => await result.json());
    const address = boxData.address.split(" ");

    if (boxData.address) {
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
    } else {
        return metadata;
    }
}

export default async function PharmBoxInfoPage(props: Props) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const boxData = await fetch(`${process.env.SERVICE_URL
            }/api/data?state=${params.state}&city=${params.city}&id=${searchParams.id}`)
            .then(async(result) => await result.json());
    if (!boxData.address) {
        redirect("/404");
    }

    const address = boxData.address.split(" ");

    return(
        <div>
            <section id="regionAndHeader" className="flex gap-2 mb-4">
                <Header isInfoPage={true} />
                <p className="text-lg md:text-2xl mt-[1.25rem]">
                    |&nbsp;
                    <Link href={`/${params.state}/${params.city}/list`}
                        className="no-underline hover:after:content-['→'] focus:after:content-['→']" >
                        {address[0]} {params.state === "sj" ? "": address[1]}
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