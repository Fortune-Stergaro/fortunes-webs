import React from 'react'
import Image from "next/image";
import { avatarImages } from "@/streamIntergration/constants";

const Viewer = ({ url, username }: { url: string | null; username: string }) => {

    // Fallback if no image is uploaded in Sanity
    const imageSrc = url || avatarImages[0]

    return (
        <div className={'flex flex-col items-center justify-center mx-1'}>
            <div className={'w-7 aspect-square rounded-full flex items-center justify-center bg-purple-400'}>
                <div className={'w-6 overflow-hidden aspect-square rounded-full bg-black relative'}>
                    <Image
                        src={imageSrc}
                        alt={username}
                        fill
                        className="object-cover"
                        sizes="32px"
                    />
                </div>
            </div>
            <p className={'text-white font-semibold text-[7px] mt-1'}>{username}</p>
        </div>
    )
}
export default Viewer