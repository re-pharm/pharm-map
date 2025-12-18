"use client"
import { loginWithSocial } from "@/app/account/in/server";

type Props = {
  provider: "github" | "kakao", 
  backUrl: string | undefined
}

export default function LoginButton(props:Props) {
  return (
    <button className="plain-btn w-full" onClick={() => loginWithSocial(props.provider, props.backUrl)}>
      {props.provider === "github" ? "GitHub" : "카카오"} 계정으로 로그인
    </button>
  );
}