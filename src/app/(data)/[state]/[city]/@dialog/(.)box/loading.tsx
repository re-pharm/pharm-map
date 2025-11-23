import Dialog from "@/app/components/layouts/Dialog";
import Loading from "@/app/components/layouts/Loading";

export default function loading() {
  return <Dialog fallback={true}>
    <Loading />
    <p>데이터 검증 중이에요</p>
  </Dialog>
}