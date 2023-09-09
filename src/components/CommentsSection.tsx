import { SparklesIcon } from "@heroicons/react/20/solid";
import { NDKEvent, NDKKind, NDKTag, NDKFilter } from '@nostr-dev-kit/ndk';
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { useNDK } from "@nostr-dev-kit/ndk-react";


type Props = {
    eventID: string | undefined;
    lyricsEvent: NDKEvent;
}

function CommentsSection({ eventID, lyricsEvent }: Props) {

    const { ndk } = useNDK();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [userCommentContent, setUserCommentContent] = useState<string>("")
    const [fetchedEvents, setFetchedEvents] = useState<NDKEvent[]>([]);
    const { fetchEvents } = useNDK();

    const filter: NDKFilter = {
        kinds: [1],
        "#e": [`${lyricsEvent.id}`]
    };

    useMemo(() => {
        const fetchData = async () => {
            console.log("fetching comments...")
            setLoading(true);
            console.log(filter)
            try {
                const response = await fetchEvents(filter);
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
        "Imagine the song's lyrics as the dialogue in a quirky indie film. What's the scene?",
        "Which of these lyrics would make the best inspirational tattoo, and where would you put it?",
        "If this song's lyrics were a secret code, what would they be hiding?",
        "If you could teleport to the world described in this song's lyrics, where would you end up?",
        "If you were an alien hearing this song for the first time, what would you think the lyrics mean?",
    ]

    const getRandomPrompt = () => {
        const randomIndex = Math.floor(Math.random() * 24) + 1;
        return prompts[randomIndex]
    }

    const getPlaceholderPrompt = () => {
        console.log("getting another prompt")
        setSelectedPrompt(getRandomPrompt());
        console.log(userCommentContent)
    }

    const [selectedPrompt, setSelectedPrompt] = useState<string>(getRandomPrompt())


    const onChange = (e: any) => {
        setUserCommentContent(e.target.value,);
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!user) {
            setLoading(false);
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
                toast.success("Posted! 🎶✅")
            }


        }
    }

    return (
        <div>
            <div className="border border-slate-400 p-2 rounded-lg splash-card">
                <form onSubmit={onSubmit} method='POST'>
                    <div className="mb-6 m-2">
                        <textarea
                            id="content"
                            name="content"
                            onChange={onChange}

                            required
                            rows={4}
                            className=" placeholder:text-lg block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={selectedPrompt}
                        >
                        </textarea>
                    </div>
                    <div className="flex items-center justify-between mx-2">
                        <button
                            onClick={() => { getPlaceholderPrompt() }}
                            type="button"
                            className="border-black border-2 flex items-center h-10  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                        >
                            <SparklesIcon className="w-5 h-5 inline-block mr-2" />
                            Get Another Prompt
                        </button>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 w-min focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 block">
                            Comment
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <div>
                    {loading ? (
                        // While loading, display a loading message with an animation
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading comments...</p>
                        </div>
                    ) : fetchedEvents  ? (
                        // If events are fetched, display them
                        fetchedEvents.map((event) => (
                            <div key={event.id}>
                                {/* Render your JSX for each event here */}
                                <p>{event.content}</p>
                                {/* Other event details */}
                            </div>
                        ))
                    ) : (
                        // If no events were fetched or there was an error, display a message
                        <p>No events found or there was an error fetching events.</p>
                    )}
                </div>
            </div>


        </div>
    )
}

export default CommentsSection