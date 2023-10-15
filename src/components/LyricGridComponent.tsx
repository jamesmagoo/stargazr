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
        <Link
            to={`lyric/${event.id}`}
            onClick={() => { setEvent(event); }}
            className="bg-gradient-to-b from-transparent via-transparent via-20% to-black to-90% relative border border-black rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 aspect-square overflow-hidden"
        >
            <img
                src={imageUrl}
                className="absolute w-full h-full object-cover mix-blend-overlay"
                
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-2xl text-white mb-4 font-semibold">
                    {event.tags.find((tag) => tag[0] === 'title')?.[1]}
                </h2>
                <p className="text-white truncate text-ellipsis italic h-10 text-lg">
                    {event.content}
                </p>
            </div>
        </Link>

    )
}

export default LyricGridComponent