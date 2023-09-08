import { NDKEvent } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'
import { useEvent } from '../context/EventContext'


type Props = {
    event: NDKEvent;
    imageUrl: string
}

function LyricGridComponent({ event, imageUrl }: Props) {
    const { setEvent } = useEvent();

  

    return (
        <Link to={`lyric/${event.id}`}
        onClick={()=>{setEvent(event)}}
            className="cursor-pointer relative bg-white border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 aspect-square"
            style={{ backgroundImage: `url('${imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
        }
        >
            <div className="block relative">
                {/* Semi-transparent background for text */}
                <div className="absolute inset-0 bg-white bg-opacity-70 rounded-md blur-lg"></div>
                {/* Text content */}
                <div className="relative text-black z-1 p-2">
                    <h2 className="text-2xl mb-4 font-semibold">{event.tags.find((tag) => tag[0] === 'title')?.[1]}</h2>
                    <p className="text-black truncate text-ellipsis italic h-10 text-3xl">{event.content}</p>
                </div>
            </div>
            {/* <div className='my-2 flex flex-row bg-slate-500'>
                <button></button>
            </div> */}
        </Link>
    )
}

export default LyricGridComponent