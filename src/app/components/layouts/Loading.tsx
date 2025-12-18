import { LoadingIcon } from "@/app/components/ani/LoadingIcon";
import { faPills } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full md:min-w-max gap-4"
      id="loading-info">
      {/* <LoadingIcon initial={false} animate={{ rotate: [0, 360]}} transition={{ duration: 0.7, repeat: Infinity }} /> */}
      <FontAwesomeIcon icon={faPills} className="animate-spin" size="2x" />
      <p>데이터를 불러오는 중</p>
    </div>)
}