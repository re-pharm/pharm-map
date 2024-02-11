import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";
import Sqids from "sqids";

type Data = {
    [index: string]: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');
    const integrated: string | null = searchParams.get('integrated');
    
    const hash = new Sqids({
        alphabet: process.env.HASH,
        minLength: 5
    });

    try {
        const list = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${state}${
            integrated === "true" ? `?sub=eq.${city}&` : `_${city}?`
        }order=last_updated.desc,name.asc`, sbHeader).then((res) => res.json());
        const data: Data[] = [];
        
        list.forEach((place: Data) => {
            data.push({
                id: hash.encode([Number(place.id)]),
                name: place.name,
                location: place.address,
                type: place.type,
                tel: place.call,
                lat: place.lat,
                lng: place.lng,
                last_updated: place.last_updated
            });
        });

        return NextResponse.json({
            data: data
        });
    } catch(e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export const runtime = 'edge';