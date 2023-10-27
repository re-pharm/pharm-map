import { NextResponse } from "next/server";
import goyang from "./goyang.json";

export function getPharmBoxList() {
    return [goyang, { status: 200}];
}

export async function GET() {
    return NextResponse.json(getPharmBoxList);
}

export const runtime = 'edge';