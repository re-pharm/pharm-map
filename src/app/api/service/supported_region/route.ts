import { NextResponse } from "next/server";
import data from "./region.json";

type StateType = {
    code: string,
    name: string
}

type RegionType = {
    state: StateType[],
    city: {[key: string]: StateType[]}
}

const region: RegionType = data;

export function validateLocationValue(stateCode: string, cityCode: string) {
    const stateData = region.state.find((province) => province.code === stateCode);

    if (stateData) {
        const cityData = region.city[stateData.code].find((town) => town.code === cityCode);
        if (cityData) {
            return {
                valid: true,
                state: stateData.name,
                city: cityData.name
            }
        }
    }
    
    return {
        valid: false
    }
}

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
                
                return NextResponse.json({error: "찾고 있는 지역이 없습니다."}, {status: 400});
            }

            return NextResponse.json({error: "찾고 있는 지역이 없습니다."}, {status: 400});
        default:
            return NextResponse.json({error: "잘못된 지역 분류입니다."}, {status: 400});
    }
}

export const runtime = 'edge';