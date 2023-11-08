import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";
import Dialog from "@/app/components/layouts/Dialog";
import type { Data } from "@/app/types/listdata";

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
        <Dialog state={params.state} city={params.city}>
            <PharmBoxInfo currentData={filterResult[0]} /> 
        </Dialog>
    ); 
}

export const runtime = 'edge';