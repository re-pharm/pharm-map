import { NextResponse } from "next/server";
import data from "./region.json";
import { ERROR } from "@/app/types/errormessages";

type StateType = {
    code: string,
    name: string
}

export type RegionType = {
    state: StateType[],
    city: {[key: string]: StateType[]}
}

const region: RegionType = data;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type: string | null = searchParams.get('type');
    const state: string | null = searchParams.get('state');
    const city: string | null = searchParams.get('city');

    switch(type) {
        case "state":
            return NextResponse.json(region.state);
        case "city":
            if (state !== null && region.city[state])
                return NextResponse.json(region.city[state]);
            else
                return NextResponse.json({error: "없는 지역입니다."}, {status: 404});
        case "geo":
            const stateResult = region.state.find((province) => province.name === state) ||
                region.state.find((province) => province.code === state);

            if (stateResult !== undefined) {
                const cityResult = region.city[stateResult.code].find((town) => town.name === city) ||
                    region.city[stateResult.code].find((town) => town.code === city);

                if (cityResult !== undefined) {
                    return NextResponse.json({
                        state: stateResult,
                        city: cityResult
                    });
                }
                
                return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
            }

            return NextResponse.json({error: ERROR.UNSUPPORTED}, {status: 400});
        default:
            return NextResponse.json({error: ERROR.INVALIDATE_REGION}, {status: 400});
    }
}

export const runtime = 'edge';