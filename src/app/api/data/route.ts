import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";
import Sqids from "sqids";
import { pharm_boxes, supported_cities, supported_states } from "@/schemas/data";
import { db } from "@/app/utils/data/database";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state: string | null = searchParams.get('state');
  const city: string | null = searchParams.get('city');
  const id: string | null = searchParams.get('id');

  const hash = new Sqids({
    alphabet: process.env.HASH
  });

  try {
    const info = await db.select({
      state: {
        code: supported_states.code,
        name: supported_states.name 
      },
      city: {
        id: supported_cities.id,
        code: supported_cities.code,
        name: supported_cities.name,
        origin: supported_cities.origin
      }
    }).from(supported_cities).leftJoin(supported_states, eq(supported_states.code, supported_cities.state))
      .where(eq(supported_cities.code, city as string));
    const data = await db.select().from(pharm_boxes).where(eq(pharm_boxes.id, hash.decode(id ?? "")[0]));

    if (data.length > 0 && info.length > 0) {
      return NextResponse.json({
        name: data[0].name,
        address: data[0].address,
        type: data[0].type,
        memo: data[0].memo ?? null,
        call: data[0].call ?? null,
        lat: data[0].lat,
        lng: data[0].lng,
        last_updated: data[0].updated,
        origin: info[0].city.origin
      });
    } else {
      return NextResponse.json({ error: "No info returned" }, { status: 500 });
    }
  } catch(e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}