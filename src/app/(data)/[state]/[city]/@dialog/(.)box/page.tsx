import Dialog from "@/app/components/layouts/Dialog";
import PharmBoxInfo from "@/app/components/data/PharmBoxInfo";

type Params = { 
    params: Promise<{
        state: string,
        city: string,
    }>,
    searchParams: Promise<{
        id: string
    }>
}

export default async function PharmBoxInfoDialog(props: Params) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const boxData = await fetch(`${process.env.SERVICE_URL
    }/api/data?state=${params.state}&city=${params.city}&id=${searchParams.id}`)
        .then(async(result) => await result.json());

    return (
        <Dialog state={params.state} city={params.city} id={searchParams.id} name="수거함 정보">
            <PharmBoxInfo currentData={boxData} />
        </Dialog>
    );
}

export const runtime = 'edge';