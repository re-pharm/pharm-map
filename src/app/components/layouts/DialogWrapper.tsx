import { Suspense } from "react";
import Dialog from "./Dialog";
import Loading from "./Loading";
import PharmBoxWrapper from "../data/PharmBoxWrapper";

type Props = { 
    params: Promise<{
        state: string,
        city: string,
    }>,
    searchParams: Promise<{
        id: string
    }>
}

export default async function DialogWrapper(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return (<Dialog state={params.state} city={params.city} id={searchParams.id} name="수거함 정보">
      <Suspense fallback={<Loading />}>
          <PharmBoxWrapper state={params.state} city={params.city} id={searchParams.id} isDialog={true} />
      </Suspense>
  </Dialog>)
}