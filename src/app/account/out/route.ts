import { auth } from "@/app/utils/user/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await auth.api.signOut({
    headers: await headers(),
  });

  if (response && response.success) {
    return NextResponse.redirect(new URL("/?logout=true", request.url))
  }
}