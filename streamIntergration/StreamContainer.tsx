"use client" // <--- This makes it a Client Component

import React, { useState, useEffect } from 'react'
import { StreamContLightParticles } from "@/streamIntergration/particles/StreamContLightParticles";
import Viewer from "@/streamIntergration/Viewer";
import { getFreshViewers, type ViewerData } from "@/streamIntergration/sanity/actions";  // Import from your actions file

export default function StreamViewers() {
    const [viewers, setViewers] = useState<ViewerData[]>([])
    const [isLoaded, setIsLoaded] = useState(false)


    // NEW: State for opacity control
    const [currentOpacity, setCurrentOpacity] = useState(1) // 1 = 100%, 0.5 = 50%, 0.1 = 10%

    // This function handles the fetching
    const fetchData = async () => {
        const freshData = await getFreshViewers()
        setViewers(freshData)
        setIsLoaded(true)
    }

    useEffect(() => {
        // 1. Fetch immediately on mount
        fetchData()

        // 2. Set up interval to fetch every 5 seconds
        const interval = setInterval(() => {
            fetchData()
        }, 5000)

        // 3. Cleanup on unmount
        return () => clearInterval(interval)
    }, [])

    return (
        <div
            className="absolute opacity-[]  flex flex-row items-center justify-center flex-wrap gap-2 p-4"
        >
            <main   className="p-1 transition-opacity duration-500 ease-in-out"
                    style={{ opacity: currentOpacity }}
            >
                <div className={'flex p-1 items-center justify-center bg-gray-600 w-fit h-fit ml-4 mt-4 rounded-md'}>
                    <div className={'relative overflow-hidden w-fit h-44 border-4 rounded-md bg-black'}>

                        <StreamContLightParticles />

                        <div className={'relative z-10 grid grid-cols-2 gap-4 w-fit h-fit py-2 px-4'}>

                            {/*
                                We don't need the if() check here anymore because
                                the GROQ query in the Server Action already filtered
                                out the old users.
                            */}
                            {viewers.map((viewer) => (
                                <Viewer
                                    url={viewer.url || ''}
                                    username={viewer.username}
                                    key={viewer._id}
                                />
                            ))}

                            {isLoaded && viewers.length === 0 && (
                                <p className="text-white text-xs col-span-2">Waiting for viewers...</p>
                            )}

                            {!isLoaded && (
                                <p className="text-white text-xs col-span-2 animate-pulse">Loading...</p>
                            )}
                        </div>

                    </div>
                </div>
            </main>
            <aside
                className="mt-4 pt-1"
                style={{ opacity: currentOpacity }}
            >
                {/*
                   Container visually looks like a vertical pill/circle
                   holding the 3 buttons
                */}
                <div className="flex flex-col items-center justify-center gap-2 bg-zinc-800/80 border border-zinc-600 p-1.5 rounded-full backdrop-blur-sm shadow-lg">

                    {/* Top Circle: 100% Opacity */}
                    <button
                        onClick={() => setCurrentOpacity(1)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentOpacity === 1
                                ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] scale-110'
                                : 'bg-zinc-500 hover:bg-zinc-400'
                        }`}
                        aria-label="Set opacity to 100%"
                    />

                    {/* Middle Circle: 50% Opacity */}
                    <button
                        onClick={() => setCurrentOpacity(0.5)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentOpacity === 0.5
                                ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)] scale-110'
                                : 'bg-zinc-500 hover:bg-zinc-400'
                        }`}
                        aria-label="Set opacity to 50%"
                    />

                    {/* Bottom Circle: 10% Opacity */}
                    <button
                        onClick={() => setCurrentOpacity(0.1)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentOpacity === 0.1
                                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110'
                                : 'bg-zinc-500 hover:bg-zinc-400'
                        }`}
                        aria-label="Set opacity to 10%"
                    />
                </div>
            </aside>
        </div>
    )
}