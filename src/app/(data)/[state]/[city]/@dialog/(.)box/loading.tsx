import { LoadingIcon } from "@/app/components/ani/LoadingIcon";

export default function Loading() {

  return (
  <div className="flex flex-col items-center justify-center p-4 w-full md:min-w-max gap-4"
    id="loading-info">
    <LoadingIcon initial={false} animate={{ rotate: [0, 360]}} transition={{ duration: 0.7, repeat: Infinity }} />
    <p>데이터를 불러오는 중</p>
  </div>)
}