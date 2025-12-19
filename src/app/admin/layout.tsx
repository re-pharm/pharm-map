import Header from "@/app/components/layouts/Header";
import { auth } from "@/app/utils/user/auth";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/account/in");
  } else if (session && session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div>
      <section id="heading" className="flex gap-2 mb-4 w-full">
        <Header isInfoPage={true} />
        <h2 className="text-lg md:text-2xl mt-5">
          |&nbsp;
          <Link href="/admin" className="hidden md:inline no-underline">관리</Link>
        </h2>
      </section>
      <div className="rounded-xl shadow-md p-2 flex gap-2 my-4 items-center">
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>현재 관리 기능은 테스트 중이며, 불안정할 수 있어요.</span>
      </div>
      <section id="main">
        {children}
      </section>
    </div>
  )
}