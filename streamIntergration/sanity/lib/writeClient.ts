import {createClient} from "next-sanity";

export const writeClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN, // Secure server-side token
    apiVersion: "2024-01-01",
    useCdn: false,
})

