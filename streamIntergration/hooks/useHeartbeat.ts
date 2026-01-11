import { useEffect } from 'react'
import { sendHeartbeat } from '@/streamIntergration/sanity/actions'

export function useHeartbeat() {
    useEffect(() => {
        const viewerId = localStorage.getItem("portfolio_viewer_id")

        // If no ID, we are anonymous, do nothing
        if (!viewerId) return

        // 1. Ping immediately on mount (to wake up the avatar if it was hidden)
        sendHeartbeat(viewerId)

        // 2. Set interval to ping every 30 seconds
        const intervalId = setInterval(() => {
            sendHeartbeat(viewerId)
        }, 15 * 1000) // 30 seconds

        // Cleanup
        return () => clearInterval(intervalId)
    }, [])
}