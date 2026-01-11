import React from 'react'
import StreamContainer from "@/streamIntergration/StreamContainer";
import IntroModal from "@/streamIntergration/IntroModal";

const StreamIntegration = () => {
    return (
        <main className="absolute max-w-screen w-[99%] h-[99%] mx-auto border ">
            <StreamContainer />
            <IntroModal />
        </main>
    )
}
export default StreamIntegration
