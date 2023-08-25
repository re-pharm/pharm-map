import { NextResponse } from "next/server";
import goyang from "./goyang.json";

export async function GET() {
    return NextResponse.json(goyang);
}

export const runtime = 'edge';