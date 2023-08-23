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

    switch(type) {
        case "state":
            return NextResponse.json(region.state);
        case "city":
            if (state !== null && region.city[state])
                return NextResponse.json(region.city[state]);
            else
                return NextResponse.json({error: "없는 지역입니다."}, {status: 404});
        default:
            return NextResponse.json({error: "잘못된 지역 분류입니다."}, {status: 400});
    }
}