import { Suspense } from "react";
import DialogFallback from "@/app/components/layouts/DialogFallback";
import DialogWrapper from "@/app/components/layouts/DialogWrapper";

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
    return (
        <Suspense fallback={<DialogFallback />}>
            <DialogWrapper params={props.params} searchParams={props.searchParams} />
        </Suspense>
    );
}

export const runtime = 'edge';