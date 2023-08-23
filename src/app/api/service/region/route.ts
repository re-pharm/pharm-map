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

export async function GET(request: Request) {
    const region: RegionType = data;
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
            const stateResult = region.state.find((province) => province.name === state);

            if (stateResult !== undefined) {
                const cityResult = region.city[stateResult.name].find((town) => town.name === city);
                if (cityResult !== undefined) {
                    return NextResponse.json({
                        state: stateResult,
                        city: cityResult
                    });
                } else {
                    return NextResponse.json({error: "찾고 있는 지역이 없습니다."}, {status: 400});
                }
            } else {
                return NextResponse.json({error: "찾고 있는 지역이 없습니다."}, {status: 400});
            }
            break;
        default:
            return NextResponse.json({error: "잘못된 지역 분류입니다."}, {status: 400});
    }
}