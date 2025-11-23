import type { Metadata } from 'next';
import Link from "next/link";
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { metadata } from '@/app/layout';
import Header from "@/app/components/layouts/Header"
import Loading from '@/app/components/layouts/Loading';
import PharmBoxWrapper from '@/app/components/data/PharmBoxWrapper';

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
                <p className="text-lg md:text-2xl mt-5">
                    |&nbsp;
                    <Link href={`/${params.state}/${params.city}/list`}
                        className="no-underline hover:after:content-['→'] focus:after:content-['→']" >
                        {address[0]} {params.state === "sj" ? "": address[1]}
                    </Link>
                    <span className="hidden md:inline">&nbsp;수거함 정보</span>
                </p>
            </section>
            <section id="info" className="flex shadow-lg p-4 rounded-2xl">
                <Suspense fallback={<Loading />}>
                    <PharmBoxWrapper state={params.state} city={params.city} id={searchParams.id} isDialog={false} />
                </Suspense>
            </section>
        </div>
    );
}

export const runtime = 'edge';