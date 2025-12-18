import Link from "next/link";


export default async function AdminMainPage() {
  
  return (
    <div>
      <Link href="/admin/data" className="plain-btn-link block">
        <p className="text-2xl">데이터 관리하기 &gt;</p>
        <p>폐의약품 수거함 데이터를 업로드, 추가, 삭제, 수정할 수 있어요.</p>
      </Link>
      <Link href="/admin/regions" className="plain-btn-link block">
        <p className="text-2xl">지역 관리하기 &gt;</p>
        <p>지역을 새로 추가하거나, 지원 지역 활성화/비활성화할 수 있어요.</p>
      </Link>
      <Link href="/admin/data" className="plain-btn-link block">
        <p className="text-2xl">사용자 관리하기 &gt;</p>
        <p>중재자를 임명, 해임하거나 관리자 계정을 다른 사용자에게 넘길 수 있어요.</p>
      </Link>
      <button className="plain-btn block" disabled>
        <p className="text-2xl text-start">제안 관리하기 &gt;</p>
        <p>제안 관리 기능은 현재 준비 중이에요.</p>
      </button>
    </div>
  )
}