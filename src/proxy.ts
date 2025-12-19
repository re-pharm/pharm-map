import { NextResponse } from "next/server";
import { sbHeader } from "./app/types/rest";
import { NextRequest } from "next/server";
import { auth } from "./app/utils/user/auth";
import { headers } from "next/headers";
import { db } from "./app/utils/data/database";
import { and, eq } from "drizzle-orm";
import { supported_cities, supported_states } from "./schemas/data";

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
          const validate = await db.select().from(supported_cities)
            .leftJoin(supported_states, eq(supported_cities.state, supported_states.code))
            .where(
              and(
                eq(supported_cities.avail, true),
                and(eq(supported_states.code, params[1]), eq(supported_cities.code, params[2]))
              )
            );

          if (validate.length < 1) {
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