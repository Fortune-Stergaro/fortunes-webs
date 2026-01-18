'use server'

import { createClient } from "next-sanity"
import { revalidatePath } from "next/cache"
import {writeClient} from "@/streamIntergration/sanity/lib/writeClient";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: "2024-01-01",
    useCdn: false,
})


// Define the type here so we can share it
export interface ViewerData {
    _id: string;
    username: string;
    url: string | null;
    lastActive: string;
}

export async function getFreshViewers() {
    // 1. Calculate the threshold on the server
    const date = new Date()
    date.setMinutes(date.getMinutes() - 0.2) // 0.2 minute ago
    const threshold = date.toISOString()

    // 2. Query Sanity
    // We filter in GROQ directly (faster than filtering in JS)
    const query = `*[_type == "viewer" && lastActive > $threshold] {
      _id,
      username,
      "url": avatar.asset->url,
      lastActive
  }`

    // 3. Fetch with no-cache so we always get the latest
    const viewers: ViewerData[] = await client.fetch(query, { threshold }, {
        cache: 'no-store'
    })

    return viewers
}

export async function createViewer(formData: FormData) {
    const username = formData.get("username") as string
    const imageFile = formData.get("image") as File | null

    if (!username) return { success: false, error: "Username required" }

    try {
        let imageAssetId = null

        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const asset = await client.assets.upload("image", buffer, {
                filename: imageFile.name,
            })
            imageAssetId = asset._id
        }

        // Capture the created document
        const newDoc = await client.create({
            _type: "viewer",
            username: username,
            // ✅ ADDED: Set timestamp immediately so they appear instantly
            lastActive: new Date().toISOString(),
            ...(imageAssetId && {
                avatar: {
                    _type: "image",
                    asset: { _type: "reference", _ref: imageAssetId },
                },
            }),
        })

        revalidatePath("/")

        return { success: true, viewerId: newDoc._id }

    } catch (error) {
        console.error("Sanity Action Error:", error)
        return { success: false, error: "Failed to join stream" }
    }
}

export async function sendHeartbeat(viewerId: string) {
    if (!viewerId) return

    try {
        // Patch the document with the current time
        await writeClient
            .patch(viewerId)
            .set({ lastActive: new Date().toISOString() })
            .commit({ visibility: 'async' }) // 'async' is faster, doesn't wait for indexer

        return { success: true }
    } catch (error) {
        console.error("Heartbeat failed:", error)
        return { success: false }
    }
}