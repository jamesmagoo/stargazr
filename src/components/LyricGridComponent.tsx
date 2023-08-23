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
        // <div key={index} className="cursor-pointer bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-100 ease-in-out">
        //     <p className="text-lg font-semibold">{event.tags.find((tag: any) => tag[0] === 'title')?.[1]}</p>
        //     {/* <p className="text-gray-600 truncate text-ellipsis">{event.id}</p> */}
        //     <p className="text-gray-500 truncate text-ellipsis italic">{event.content}</p>
        //     {/* Placeholder image at the bottom */}
        //     <img
        //         src={imageUrl}
        //         alt={`Placeholder Image ${index + 1}`}
        //         className="mt-4"
        //     />
        //     <div className='my-2 flex flex-row bg-slate-500'>
        //         <button></button>
        //     </div>
        // </div>
        // <div
        //     key={index}
        //     className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 ease-in-out"
        //     style={{ backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        // >
        //     <Link to={`/your-new-page/${event.id}`} className="block">
        //         <p className="text-lg font-semibold">{event.tags.find((tag) => tag[0] === 'title')?.[1]}</p>
        //         <p className="text-gray-500 truncate text-ellipsis italic">{event.content}</p>
        //     </Link>
        //     <div className='my-2 flex flex-row bg-slate-500'>
        //         <button></button>
        //     </div>
        // </div>
        <div
            key={index}
            className="cursor-pointer relative bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 ease-in-out hover:scale-105"
            style={{ backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <Link to={`lyrics/${event.id}`} className="block relative">
                {/* Semi-transparent background for text */}
                <div className="absolute inset-0 bg-white bg-opacity-70 rounded-md blur-lg"></div>
                {/* Text content */}
                <div className="relative text-black z-1 p-2">
                    <h2 className="text-2xl mb-4 font-semibold">{event.tags.find((tag) => tag[0] === 'title')?.[1]}</h2>
                    <p className="text-black truncate text-ellipsis italic h-10">{event.content}</p>
                </div>
            </Link>
            {/* <div className='my-2 flex flex-row bg-slate-500'>
                <button></button>
            </div> */}
        </div>
        


    )
}

export default LyricGridComponent