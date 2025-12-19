import Link from "next/link";

export default async function AdminDataPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <aside className="w-120 min-w-80">
        <h3 className="text-2xl">데이터 관리</h3>
        <Link href="/admin/data" className="plain-btn-link block">
          <p className="text-xl">업로드 &gt;</p>
          <p>CSV 파일을 업로드하여 대량으로 추가할 수 있어요.</p>
        </Link>
        <Link href="/admin/data/modify" className="plain-btn-link block">
          <p className="text-xl">관리 &gt;</p>
          <p>수거함을 삭제하거나 수정할 수 있어요</p>
        </Link>
        <button className="plain-btn block" disabled>
          <p className="text-xl text-start">제안 검토 &gt;</p>
          <p className="text-start">수거함 정보에 대한 수정 요청을 검토하는 기능은 준비 중이에요.</p>
        </button>
      </aside>
      <section id="main-content" className="w-full">
        {children}
      </section>
    </div>
  )
}