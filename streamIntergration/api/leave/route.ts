//streamIntergration/api/leave/route.ts:3

import { NextResponse } from "next/server";
import {writeClient} from "@/streamIntergration/sanity/lib/writeClient";

export async function POST(req: Request) {
    try {
        // sendBeacon sends "text/plain" by default, so we parse it manually
        const body = await req.text();
        const { viewerId } = JSON.parse(body);

        if (viewerId) {
            await writeClient.delete(viewerId);
            console.log(`Viewer ${viewerId} removed`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove viewer", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
