import { NextResponse } from "next/server";

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
    const page: string | null = searchParams.get('page');

    try {
        //0: 폐의약품 수거함 위치, 1: 폐의약품 수거 약국 위치
        const guriList = await Promise.all([
            fetch(`https://api.odcloud.kr/api/15074686/v1/uddi:969c010f-aa4c-4e89-aedf-f933371d1c44?serviceKey=${process.env.DATA_GO_KR_REST_KEY}`).then((res) => res.json()),
            fetch(`https://api.odcloud.kr/api/15074687/v1/uddi:88f1e037-d8b2-46a8-8aec-ed4316180345?perPage=90&serviceKey=${process.env.DATA_GO_KR_REST_KEY}`).then((res) => res.json())
        ]);
        const data: Data[] = [];
        
        guriList[0].data.forEach((place: Data) => {
            data.push({
                name: place["설치 장소"],
                location: place["위치(도로명)"],
                type: "public",
                tel: place["전화번호"],
                lat: place["위도"],
                lng: place["경도"]
            });
        });

        guriList[1].data.forEach((place: Data) => {
            data.push({
                name: place["약국명칭"],
                location: place["약국소재지(도로명)"],
                type: "pharm",
                tel: place["전화번호"],
                lat: place["위도"],
                lng: place["경도"]
            })
        })

        return NextResponse.json({
            data: data,
            date: "20230607",
            center: {
                "lat": "37.59417",
                "lng": "127.12968"
            }
        });
    } catch(e) {
        return NextResponse.json({ error: e}, { status: 500 });
    }    
}

export const runtime = 'edge';