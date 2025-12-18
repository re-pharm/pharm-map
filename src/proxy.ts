import { NextResponse } from "next/server";
import { sbHeader } from "./app/types/rest";
import { NextRequest } from "next/server";
import { auth } from "./app/utils/user/auth";
import { headers } from "next/headers";

// 지역 및 ID가 유효한 데이터인지 검증하는 역할
export async function proxy(request: NextRequest) {
  const params = request.nextUrl.pathname.split("/");
  const session = await auth.api.getSession({
    headers: await headers()
  });

  switch (params.length) {
    case 2:
      if (params[1] === "account") {
        if (session) {
          return NextResponse.redirect(new URL("/account/profile", request.url));
        } else {
          return NextResponse.redirect(new URL("/account/in", request.url));
        }
      }
      break;
    case 3:
      if (!["account", "admin"].includes(params[1])) {
        console.log(params)
        return NextResponse.redirect(new URL(
          `${request.nextUrl.pathname}/list`
          , request.url
        ));
      }
      break;
    case 4:
      switch (params[3]) {
        case "box":
          const id = request.nextUrl.searchParams.get("id");

          if (!id || id.length < 5 || !Number.isNaN(Number(id))) {
            return NextResponse.error();
          }
        case "list":
          const validate = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities?select=${
            `available&and=(state.eq.${params[1]}, code.eq.${params[2]})`}`, sbHeader);
          const available = await validate.json();            

          if (!validate.ok) {
            return NextResponse.error();
          } else if (available.length < 1 || !available[0].available) {
            return NextResponse.error();
          }
        default:
          return NextResponse.next();
      }
  }
}

export const config = {
  matcher: '/((?!api|dashboard|about|_next/static|_next/image|font|capsule.svg).*)',
}