import { SparklesIcon } from "@heroicons/react/20/solid";
import { NDKEvent, NDKFilter, NDKKind, NDKTag } from '@nostr-dev-kit/ndk';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import  useZap from "../hooks/useZap"
import Spinner from "./Spinner";


type Props = {
    eventID: string | undefined;
    lyricsEvent: NDKEvent;
}

function CommentsSection({ eventID, lyricsEvent }: Props) {

    const { ndk } = useNDK();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [ publishing, setPublishing] = useState(false)
    const [userCommentContent, setUserCommentContent] = useState<string>("")
    const [fetchedEvents, setFetchedEvents] = useState<NDKEvent[]>([]);
    const { fetchEvents } = useNDK();
    const { handleZap } = useZap()

 
    const filter: NDKFilter = {
        kinds: [1],
        "#e": [`${eventID}`]
    };

    useMemo(() => {
        const fetchData = async () => {
            console.log("fetching comments...")
            setLoading(true);
            console.log(filter)
            try {
                const response = await fetchEvents(filter);
                // get profiles of the events to display 
                // TODO do this better some day 
                for (let event of response) {
                    try {
                        await event.author.fetchProfile()
                    } catch (err) {
                        console.log("couldnt get a profile for event")
                    }
                }
                setLoading(false);
                setFetchedEvents(response);
                console.log(response)
            } catch (error) {
                // Handle errors, e.g., log or display an error message
                console.error("Error fetching events:", error);
                setLoading(false);
                return null; // You can return a default value or handle the error differently
            }
        };
        return fetchData();
    }, [eventID]);


    const prompts = [
        "Desribe your best listen of this song...",
        "What do you think this song is saying?",
        "Desribe a scene that needs this as the backing track..",
        "What imagery comes to mind?",
        "Say what this song means to you..",
        "What is the line that resonates most for you?",
        "Do you remember the first time you heard this song?",
        "How does this song make you feel?",
        "Tag someody who needs to listen to this!",
        "Share something you think about this song",
        "Share a lyric from the song that's stuck in your head right now.",
        "What's your favorite part of the song's lyrics?",
        "Tell us how the lyrics of this song make you feel.",
        "Which line in the song speaks to you the most?",
        "Discuss the storytelling in the song's lyrics.",
        "Explain the meaning you find in these lyrics.",
        "What emotions do these lyrics evoke for you?",
        "Share a lyric that you think everyone should hear.",
        "Expand the clever wordplay in this song's lyrics.",
        "How do these lyrics relate to your own experiences?",
        "If this song's lyrics were a secret code, what would they be hiding?",
        "If you could teleport to the world described in this song's lyrics, where would you end up?",
    ]

    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * 21) + 1;
        return prompts[randomIndex]
    }

    const getPlaceholderPrompt = () => {
        console.log("getting another prompt")
        setSelectedPrompt(getRandomPrompt());
        console.log(userCommentContent)
    }

    const [selectedPrompt, setSelectedPrompt] = useState<string>(getRandomPrompt())


    const onChange = (e: any) => {
        setUserCommentContent(e.target.value);
    };

    const onSubmit = async (e: any) => {
        setPublishing(true)
        e.preventDefault();
        if (!user) {
            setPublishing(false);
            toast.error('Please login');
            return;
        }

        if (userCommentContent.length > 0 && (lyricsEvent !== undefined || lyricsEvent !== null)) {
            console.log("sending comment as reply to main event")
            console.log(`comment: ${userCommentContent}`)
            console.log(`to this event ${lyricsEvent?.id}`)
            console.log(`to this author ${lyricsEvent?.author.hexpubkey()}`)

            const newCommentEvent = new NDKEvent(ndk);
            newCommentEvent.kind = NDKKind.Text;
            newCommentEvent.created_at = Math.floor(Date.now() / 1000);
            newCommentEvent.content = userCommentContent;

            const newTags: NDKTag[] = [
                ["e", lyricsEvent?.id],
                ["p", lyricsEvent?.author.hexpubkey()],
            ];

            newTags.map(tag => {
                newCommentEvent.tags.push(tag);
            });

            let result = await newCommentEvent.publish();

            if (result) {
                const updatedEvents = [...fetchedEvents, newCommentEvent];
                setFetchedEvents(updatedEvents);
                toast.success("Posted! 🎶 ✅")
                setPublishing(false)
                setUserCommentContent("")
            }

        }
    }

    function formatTimestampToDateString(timestamp: number | null) {
        if (timestamp == null) return null;
        const date = new Date(timestamp * 1000); // Convert the timestamp to milliseconds (*1000)

        const day = date.getDate();
        const month = date.getMonth() + 1; // Adding 1 to the month since it's zero-based
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Pad single-digit numbers with a leading zero
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        // Create the formatted date string
        const formattedDate = `${formattedDay}-${formattedMonth}-${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

        return formattedDate;
    }

    // TODO make this better with modal default now to 21
    const zapComment = async (note : NDKEvent) =>{
       try {
           handleZap(note, "stargazr.xyz", 21)
        } catch (err){
            toast.error("Problem zapping comment - the user may not have enabled zaps!")
        }
       
    }
    const getDisplayName = (comment : NDKEvent) =>{
        //await comment.author.fetchProfile()
        const commentDisplayName =  comment.author.profile?.displayName || comment.author.profile?.name || comment.author.npub
        return commentDisplayName
    }
    return (
        <div>
            <div className='xl:text-3xl lg:text-3xl md:text-2xl text-2xl font-bold my-2 balance-card text-white justify-normal'> Share your thoughts...</div>
            <div className='xl:text-xl lg:text-xl md:text-lg text-lg italic my-2  text-white justify-normal'> {selectedPrompt}</div>
            <div className="border p-2 border-black rounded-lg bg-gray-800">
                <form onSubmit={onSubmit} method='POST'>
                    <div className="mb-6 m-2">
                        <textarea
                            id="content"
                            name="content"
                            onChange={onChange}
                            required
                            rows={4}
                            value={userCommentContent}
                            placeholder="Add your thoughts or interpretations, use a prompt for inspiration!"
                            className="h-48 placeholder:text-lg block p-2.5 w-full text-sm text-white bg-gray-900 rounded-lg border border-black focus:ring-blue-900 focus:border-blue-900"
                        >
                        </textarea>
                    </div>
                    <div className="flex items-center justify-between mx-2">
                        {!userCommentContent ? 
                        (<button
                            onClick={() => { getPlaceholderPrompt() }}
                            type="button"
                            className="border-black border-2 flex items-center h-10 text-white bg-gradient-to-l from-indigo-500 to-indigo-950  rounded-lg text-xs lg:text-sm xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                        >
                            <SparklesIcon className="w-5 h-5 inline-block mr-2" />
                            Try Another Prompt
                        </button>) :null}
                        <button
                            type="submit"
                            className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                        >
                            {publishing ? (
                                <div className="flex items-center">
                                    <span className="animate-spin inline-block mr-2">
                                        <svg
                                            className="w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </span>
                                    Sending...
                                </div>
                            ) : (<span>Comment</span>)}
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <div className="flex flex-col justify-center overflow-y-auto">
                    {loading ? (
                        <div className="animate-pulse items-center my-5 text-xl w-full text-gray-500 font-light justify-center flex flex-row">
                            <div>
                            <Spinner/>
                            </div>
                            <div>Loading...</div>
                            </div>

                    ) : fetchedEvents.length > 0 ? (
                        // If events are fetched, display them
                        fetchedEvents.map((event) => (
                            <div key={event.id} className="comment-card mx-2 text-sm space-y-3 w-auto p-2 my-2 border-2  text-slate-200 bg-gray-800 rounded-lg border-black shadow-xl">
                                <div className="flex-row flex border-b-2 border-y-0 border-x-0 border border-black">
                                    <div className="text-sm font-bold mr-4 truncate w-24 text-ellipsis">{getDisplayName(event)}</div>
                                    <div className="font-light text-slate-500">{event.created_at ? formatTimestampToDateString(event?.created_at) : null}</div>
                                </div>
                                <p className="text-base font-medium">{event.content}</p>
                                {/* <p className="text-md">{event.author.profile?.displayName}</p> */}
                                {/* TODO add like , reply, zap, report buttons etc.... */}
                                <button className="bg-gray-600 border border-black rounded p-0.5 text-xs font-semibold"onClick={()=>{zapComment(event)}}>Zap⚡️</button>
                                {/* Other event details */}
                            </div>
                        )).reverse()
                    ) : (
                        <p className=" my-5 text-xl w-full text-center text-gray-500 font-light justify-center text-mono">No comments or interpretations 🫥 , yet 😉</p>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CommentsSection