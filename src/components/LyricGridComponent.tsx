import { NDKEvent } from '@nostr-dev-kit/ndk'
import React from 'react'
import { Link } from 'react-router-dom'


type Props = {
    event: NDKEvent;
    index: number;
    imageUrl: string
}

function LyricGridComponent({ event, index, imageUrl }: Props) {
    return (
        <Link to={"lyrics"}>
        <div key={index} className="cursor-pointer bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-100 ease-in-out">
            <p className="text-lg font-semibold">{event.tags.find((tag: any) => tag[0] === 'title')?.[1]}</p>
            {/* <p className="text-gray-600 truncate text-ellipsis">{event.id}</p> */}
            <p className="text-gray-500 truncate text-ellipsis italic">{event.content}</p>
            <img
                src={imageUrl}
                alt={`Placeholder Image ${index + 1}`}
                className="mt-4"
            />
            <div className='my-2 flex flex-row bg-slate-500'>
                <button>
                    Zap
                </button>
            </div>
        </div>
        </Link>
    )
}

export default LyricGridComponent