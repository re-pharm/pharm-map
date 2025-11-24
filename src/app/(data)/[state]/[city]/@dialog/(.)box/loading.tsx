import Dialog from "@/app/components/layouts/Dialog";
import Loading from "@/app/components/layouts/Loading";

export default function loading() {
  return <Dialog fallback={true}>
    <Loading />
    <p className="text-center">추가 데이터를 받아오고 있어요</p>
  </Dialog>
}