import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";
import Sqids from "sqids";
import { db } from "@/app/utils/data/database";
import { eq } from "drizzle-orm";
import { pharm_boxes, supported_cities, supported_states } from "@/schemas/data";

type Data = {
  [index: string]: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state: string | null = searchParams.get('state');
  const city: string | null = searchParams.get('city');
    
  const hash = new Sqids({
    alphabet: process.env.HASH,
    minLength: 5
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
        lat: supported_cities.lat,
        lng: supported_cities.lng
      }
    }).from(supported_cities).leftJoin(supported_states, eq(supported_states.code, supported_cities.state))
      .where(eq(supported_cities.code, city as string));
    const list = await db.select().from(pharm_boxes).where(eq(pharm_boxes.region, info[0].city.id));
    
    const data: Data[] = [];
        
    list.forEach((place) => {
      data.push({
        id: hash.encode([Number(place.id)]),
        name: place.name,
        address: place.address,
        type: place.type,
        call: place.call ?? "",
        lat: place.lat.toString(),
        lng: place.lng.toString(),
        last_updated: place.updated.toString()
      });
    });

    return NextResponse.json({
      data: data,
      city: {
        lat: info[0].city.lat,
        lng: info[0].city.lng,
        name: info[0].city.name,
      },
      state: {
        name: info[0].state?.name
      }
    });
  } catch(e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
