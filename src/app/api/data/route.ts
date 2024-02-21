import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";
import Sqids from "sqids";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');
    const id: string | null = searchParams.get('id');

    const hash = new Sqids({
        alphabet: process.env.HASH
    });

    try {
        const option = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities?select=${
            `integrated`}&and=(state.eq.${state}, code.eq.${city})`, sbHeader)
            .then((res) => res.json());
        const data = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${state}${
            option[0].integrated ? `?sub=eq.${city}&` : `_${city}?`
        }${
            id !== null ? `&id=eq.${hash.decode(id)[0]}` : ""
        }`, sbHeader)
        .then((res) => res.json());

        if (data.length > 0) {
            return NextResponse.json({
                name: data[0].name,
                address: data[0].address,
                type: data[0].type,
                memo: data[0].memo ?? null,
                call: data[0].call ?? null,
                lat: data[0].lat,
                lng: data[0].lng,
                last_updated: data[0].last_updated
            });
        }
    } catch(e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export const runtime = 'edge';