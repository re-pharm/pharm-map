import { Suspense } from "react";
import Dialog from "@/app/components/layouts/Dialog";
import Loading from "./loading";
import PharmBoxWrapper from "@/app/components/data/PharmBoxWrapper";

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

    return (
        <Dialog state={params.state} city={params.city} id={searchParams.id} name="수거함 정보">
            <Suspense fallback={<Loading />}>
                <PharmBoxWrapper state={params.state} city={params.city} id={searchParams.id} isDialog={true} />
            </Suspense>
        </Dialog>
    );
}

export const runtime = 'edge';