import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

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
    const place: string | null = searchParams.get('name');

    if (!state || !city || !place) {
        return NextResponse.json({
            error: "필요한 값이 주어지지 않았습니다."
        }, { status: 400 });
    }

    const pharmInfo = await fetch(`http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire?serviceKey=${process.env.DATA_GO_KR_REST_KEY}&Q0=${encodeURIComponent(state)}&Q1=${encodeURIComponent(city)}&QT=1&QN=${encodeURIComponent(place)}&ORD=NAME&pageNo=1&numOfRows=10`).then((res) => res.text());
    const parser = new XMLParser();
    const parsedPharmInfo = parser.parse(pharmInfo);

    if (parsedPharmInfo.response) {
        if (parsedPharmInfo.response.header.resultCode === 0 && parsedPharmInfo.response.body.totalCount > 0) {
            return NextResponse.json({
                data: parsedPharmInfo.response.body.items.item
            });    
        } else if (parsedPharmInfo.body.totalCount < 1) {
            return NextResponse.json({
                error: "검색 결과가 없습니다."
            }, { status: 404});
        } else {
            return NextResponse.json({
                error: "알 수 없는 오류가 발생하였습니다."
            }, { status: 500 });
        }
    } else if (parsedPharmInfo["OpenAPI_ServiceResponse"]) {
        return NextResponse.json({
            error: parsedPharmInfo["OpenAPI_ServiceResponse"].cmmMsgHeader
        }, { status: 500 });
    }
}

export const runtime = 'edge';