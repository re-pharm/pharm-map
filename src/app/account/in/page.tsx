import LoginButton from "@/app/components/auth/LoginButton";
import Header from "@/app/components/layouts/Header";
import { auth } from "@/app/utils/user/auth";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function signInPage({ searchParams }:SearchParams) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const sp = await searchParams;
  const back = sp && sp.redirect ? sp.redirect.toString() : "/account/profile"

  if (session) {
    redirect("/account/profile");
  }

  return (
    <div>
      <section id="heading" className="flex gap-2 mb-4 w-full">
        <Header isInfoPage={true} />
        <h2 className="text-lg md:text-2xl mt-5">
          |&nbsp;
          <span className="hidden md:inline">로그인</span>
        </h2>
      </section>
      <div className="rounded-xl shadow-md p-2 flex gap-2 my-4">
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>현재 로그인 기능은 테스트 중이며, 별다른 기능을 하지 않아요.</span>
      </div>
      <section id="main" className="max-w-80">
        <LoginButton provider="github" backUrl={back} />
        <LoginButton provider="kakao" backUrl={back} />
      </section>
    </div>
  )
}