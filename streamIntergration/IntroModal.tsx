"use client";

import React, { useState, useEffect } from "react";
import { createViewer } from "@/streamIntergration/sanity/actions";
import { useHeartbeat } from "@/streamIntergration/hooks/useHeartbeat"; // Import the new hook

const IntroModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useHeartbeat();

    useEffect(() => {
        // Reset Logic: check if we actually have an ID.
        // If we have 'joined' status but no ID, we should probably reset so they can join again.
        const status = localStorage.getItem("portfolio_viewer_status");
        const id = localStorage.getItem("portfolio_viewer_id");

        if (!status || (status === 'joined' && !id)) {
            setIsOpen(true);
        }
    }, []);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        const result = await createViewer(formData);

        if (result.success && result.viewerId) {
            // 2. SAVE THE ID SO WE CAN DELETE IT LATER
            localStorage.setItem("portfolio_viewer_status", "joined");
            localStorage.setItem("portfolio_viewer_id", result.viewerId);

            setIsOpen(false);
            setIsLoading(false);
            useHeartbeat()
        } else {
            alert(result.error || "Something went wrong");
            setIsLoading(false);
        }

    }

    const handleSkip = () => {
        localStorage.setItem("portfolio_viewer_status", "skipped");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-white text-xl font-bold">Join the Stream</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                        Enter a username to appear in the live viewer list.
                    </p>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">
                            USERNAME <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="username"
                            type="text"
                            placeholder="e.g. CyberPunk99"
                            className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-zinc-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1 ml-1">
                            AVATAR (OPTIONAL)
                        </label>
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Enter Site"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="text-xs text-zinc-500 hover:text-white text-center underline decoration-zinc-700"
                    >
                        Skip and browse anonymously
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IntroModal;