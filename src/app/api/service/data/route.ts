import { NextResponse } from "next/server";
import { sbHeader } from "@/app/types/rest";

type Data = {
    [index: string]: string,
    name: string,
    location: string,
    tel: string,
    lat: string,
    lng: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');
    const integrated: string | null = searchParams.get('integrated');

    try {
        const list = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${state}${
            integrated === "true" ? `?sub=eq.${city}` : `_${city}`
        }`, sbHeader).then((res) => res.json());
        const data: Data[] = [];
        
        list.forEach((place: Data) => {
            data.push({
                name: place.name,
                location: place.address,
                type: place.type,
                tel: place.call,
                lat: place.lat,
                lng: place.lng
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