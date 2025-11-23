import Dialog from "./Dialog";
import Loading from "./Loading";

export default function DialogFallback() {
  return (<Dialog>
    <Loading />
  </Dialog>)
}