
// hooks/useViewerPresence.ts
import { useEffect } from 'react';

export function useViewerPresence() {
    useEffect(() => {
        // This runs when the component mounts
        // We only care about cleanup when the window closes

        const handleTabClose = () => {
            const viewerId = localStorage.getItem("portfolio_viewer_id");

            if (viewerId) {
                // Prepare the data
                const blob = new Blob([JSON.stringify({ viewerId })], {
                    type: 'application/json',
                });

                // sendBeacon guarantees the request is sent even if the tab closes instantly
                navigator.sendBeacon('/api/leave', blob);
            }
        };

        // Listen for tab closing or browser quitting
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Optional: You could trigger it here for mobile switching apps
                // but usually strictly closing is handled by 'pagehide' or 'beforeunload'
            }
        });

        // 'pagehide' is more reliable than 'unload' on modern browsers
        window.addEventListener('pagehide', handleTabClose);

        return () => {
            window.removeEventListener('pagehide', handleTabClose);
        };
    }, []);
}