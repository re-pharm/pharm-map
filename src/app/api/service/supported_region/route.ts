import { NextResponse } from "next/server";
import { ERROR } from "@/app/types/errormessages";
import { sbHeader } from "@/app/types/rest";

type ListType = {
    code: string,
    name: string
}

type DetailType = {
    state: {
        code: string,
        name: string
    },
    city: string,
    name?: string,
    integrated: string,
    lat: string,
    lng: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type: string | null = searchParams.get('type');
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');
    
    switch(type) {
        case "state":
            const stateList: ListType[] = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_states?available=eq.true`, 
                sbHeader)
                .then((res) => res.json());

            return NextResponse.json(stateList);
        case "city":
            if (state !== null) {
                const cityList: ListType[] = 
                    await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities${
                            `?state=eq.${state}&available=eq.true&select=code,name`
                        }`, sbHeader).then((res) => res.json());
                
                return NextResponse.json(cityList);
            } else {
                return NextResponse.json({error: "존재하지 않는 지역입니다."}, {status: 404});
            }
                
        case "geo":
        case "single":
            const data: DetailType[] = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities?select=${
                "state(name,code),name,city:code"
            }&or=(name.eq.${city},code.eq.${city})&available=eq.true`, sbHeader).then((res) => res.json());

            const selected: DetailType | null = (data.length === 1 ? data[0] :
                data.length > 1 ? data.filter((region) => (
                    region.state.name === state ||
                    region.state.code === state
                ))[0] : null);

            if (selected) {
                if (type === "geo") {
                    return NextResponse.json({
                        state: selected.state.code,
                        city: selected.city,
                        integrated: selected.integrated,
                        lat: selected.lat,
                        lng: selected.lng
                    });    
                }

                return NextResponse.json({
                    state: selected.state,
                    city: {
                        code: selected.city,
                        name: selected.name
                    }
                })
            } else {
                return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
            }
        case "current":
            const current: DetailType[] = await fetch(`${process.env.SUPABASE_URL}/rest/v1/supported_cities?select=${
                `integrated, lat, lng&and=(state.eq.${state}, code.eq.${city})`
            }`, sbHeader).then((res) => res.json());

            if (current.length > 0) {
                return NextResponse.json({
                    integrated: current[0].integrated,
                    lat: current[0].lat,
                    lng: current[0].lng
                })
            } else {
                return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
            }
        default:
            return NextResponse.json({error: ERROR.INVALIDATE_REGION}, {status: 400});
    }
}

export const runtime = 'edge';