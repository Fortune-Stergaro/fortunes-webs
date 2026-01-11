import {createClient} from "next-sanity";
import {apiVersion, dataset, projectId} from "@/sanity/env";

export const stream_client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Set false if you want real-time updates immediately
})
