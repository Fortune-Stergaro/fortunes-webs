import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

export async function POST(req: Request) {
    try {
        // sendBeacon sends "text/plain" by default, so we parse it manually
        const body = await req.text();
        const { viewerId } = JSON.parse(body);

        if (viewerId) {
            await client.delete(viewerId);
            console.log(`Viewer ${viewerId} removed`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove viewer", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
