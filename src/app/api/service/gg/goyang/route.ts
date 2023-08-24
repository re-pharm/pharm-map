import { NextResponse } from "next/server";

export async function GET() {
    const goyangPharm = await fetch(`https://api.odcloud.kr/api/15077990/v1/uddi:22309806-43d2-49c4-a2ed-c316bb12723d?serviceKey=${process.env.DATA_GO_KR_REST_KEY}`);
    const goyangData = await goyangPharm.json();

    if (goyangPharm.ok) {
        return NextResponse.json({
            data: goyangData.data,
            structure: {
                name: "영업소명",
                location: "영업소소재지(도로명)",
                tel: "영업소전화번호"
            },
            date: "20230105"
        })
    } else {
        return NextResponse.json({ error: goyangData.msg}, { status: goyangPharm.status });
    }
}

export const runtime = 'edge';