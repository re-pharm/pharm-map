import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page: string | null = searchParams.get('page');
    
    const guriBox = await fetch(`https://api.odcloud.kr/api/15074686/v1/uddi:969c010f-aa4c-4e89-aedf-f933371d1c44?serviceKey=${process.env.DATA_GO_KR_REST_KEY}`);
    const guriBoxData = await guriBox.json();

    if (guriBox.ok) {
        return NextResponse.json({
            data: guriBoxData.data,
            structure: {
                name: "설치 장소",
                location: "위치(도로명)",
                tel: "전화번호"
            },
            date: "20230329"
        })
    } else {
        return NextResponse.json({ error: guriBoxData.msg}, { status: guriBox.status });
    }
}

export const runtime = 'edge';