import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";
import Sqids from "sqids";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');
    const integrated: string | null = searchParams.get('integrated');
    const id: string | null = searchParams.get('id');

    const hash = new Sqids({
        alphabet: process.env.HASH
    });

    try {
        const data = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${state}${
            integrated === "true" ? `?sub=eq.${city}&` : `_${city}?`
        }${
            id !== null ? `&id=eq.${hash.decode(id)[0]}` : ""
        }`, sbHeader)
        .then((res) => res.json());

        return NextResponse.json({
            name: data[0].name,
            location: data[0].address,
            type: data[0].type,
            tel: data[0].call,
            lat: data[0].lat,
            lng: data[0].lng,
            last_updated: data[0].last_updated,
            memo: data[0].memo ?? null
        });
    } catch(e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export const runtime = 'edge';