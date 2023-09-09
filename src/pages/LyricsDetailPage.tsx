import { useEffect, useState } from 'react';
import CommentsList from '../components/CommentsSection'
import LyricsView from '../components/LyricsView'
import { useParams } from 'react-router-dom';
import { useEvent } from '../context/EventContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NDKEvent } from '@nostr-dev-kit/ndk';



function LyricsDetailPage() {

    const { eventID } = useParams()
    const { ndkEvents } = useEvent();
    const navigate = useNavigate()
    const [currentEvent, setCurrentEvent] = useState<NDKEvent | null>(null)


    useEffect(() => {
        const findEventByID = (id: string) => {
            console.log("searching for event in context...")
            return ndkEvents?.find((event) => event.id === id);
        };

        if (eventID) {
            const foundEvent = findEventByID(eventID);
            if (foundEvent) {
                // Set the found event as the currentEvent
                setCurrentEvent(foundEvent);
            } 
        } else {
            // Handle case where no eventID is available in the URL
            toast.error("Can't find the lyrics 😭 ")
            navigate("/lyrics")
        }

    }, [eventID])

    return (
        <>
            <div className=" mx-auto w-full flex-grow lg:flex xl:px-8 ">
                <div className="lg:w-2/3 w-full">
                    <LyricsView eventID={eventID} event={currentEvent} />
                </div>
                <div className="lg:w-1/3 h-min bg-white shadow-2xl rounded-lg w-full ml-2">
                    <div className="m-auto">
                        <CommentsList eventID={eventID}  lyricsEvent={currentEvent || new NDKEvent}/>
                    </div>
                </div>
            </div>
        </>

    )
}

export default LyricsDetailPage