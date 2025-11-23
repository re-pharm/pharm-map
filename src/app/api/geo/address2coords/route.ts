import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address: string | null = searchParams.get("loc");

    const addressData = await fetch(`https://dapi.kakao.com/v2/local/search/address.JSON?query=${address}`, {
        headers: {
            "Authorization": `KakaoAK ${process.env.KAKAO_REST_KEY}`
        }
    });
    if (addressData.ok) {
        const addressJson = await addressData.json();
        return NextResponse.json({
            lng: addressJson.documents[0].x,
            lat: addressJson.documents[0].y
        })
    } else if (addressData.status !== 500) {
        return NextResponse.json({ error: "현재 위치를 파악할 수 없습니다. 국내 주소가 맞는지, 위치 측정이 불가한 장소에 있지는 않은지 확인해주세요."}, { status: 400 });
    } else {
        return NextResponse.json({ error: "카카오 위치 변환 API 서비스가 점검 중입니다."}, { status: 500 });
    }
}

export const runtime = 'edge';