"use server"
import { auth } from "@/app/utils/user/auth"
import { redirect } from "next/navigation";

export async function loginWithSocial(media: "github" | "kakao", backUrl: string | undefined) {
  const response = await auth.api.signInSocial({
    body: {
      provider: media,
      callbackURL: backUrl ?? "/account/profile",
      scopes: media === "kakao" ? ["profile_nickname"] : undefined
    },
  });

  if (response && response.url) {
    redirect(response.url);
  } else {
    redirect("/account/in?error=response");
  }
}