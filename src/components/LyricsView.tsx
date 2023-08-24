import { useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { BoltIcon, EyeIcon } from '@heroicons/react/20/solid';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import ZapModal from '../components/ZapModal'
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import ExplorerView from '../pages/ExplorerView';
import { requestProvider } from 'webln'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { useEvent } from '../context/EventContext';
import { useParams } from 'react-router-dom';
import ZapButton from './ZapButton';

const LyricsView = () => {

  const { event, ndkEvents } = useEvent();
  const { eventID } = useParams()

  const [nodeInfo, setNodeInfo] = useState('');
  const [webln, setWebln] = useState<any>('');
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [currentEvent, setCurrentEvent] = useState<NDKEvent | null>(null)

  useEffect(() => {
    const findEventByID = (id: string) => {
      console.log("searching for event in context...")
      return ndkEvents?.find((event) => event.id === id);
    };
  
    // Check if an eventID is available
    if (eventID) {
      const foundEvent = findEventByID(eventID);  
      if (foundEvent) {
        // Set the found event as the currentEvent
        setCurrentEvent(foundEvent);
      } else {
        // Handle case where event with the specified ID was not found
        setCurrentEvent(null);
      }
    } else {
      // Handle case where no eventID is available in the URL
      setCurrentEvent(null);
    }
  
    // Set loading to false after processing
    setLoadingState(false);
  }, [eventID, ndkEvents]);


  useEffect(() => {
    async function loadRequestProvider() {
      try {
        const webln = await requestProvider();
        const nodeInfo = await webln.getInfo();
        setNodeInfo(nodeInfo.node.alias);
        setWebln(webln)
        console.log(`Connected to LN ⚡️ node info : ${nodeInfo.node.alias}`)
      } catch (err){
        console.log(err)
        console.log("Error connecting to webln")
      }
    }
    loadRequestProvider();
  }, [])

  const makeAnLNPayment = () =>{
    if(webln !== null){
      console.log(nodeInfo)
    }
  }

  const publishZapEvent = () => {
    makeAnLNPayment()
    // make a request? 
  }


  const [showZapModal, setShowZapModal] = useState(false);
  const [lyricEvents, setLyricEvents] = useState<any[]>()
  const [showCommentSection, setShowCommentSection] = useState(false)
  const { user, login, logout } = useUser();
  

  const handleCancel = () => {
    setShowZapModal(false);
  };

  const handleClose = () => {
    setShowCommentSection(false)
  }

  const handleZap = async () => {
    try {
      if (user) {
        console.log(`User logged in we can zap.. ${user.npub}`)
      } else {
        console.log("no user ")
      }
      //toast.success(`ZAPPPPPPP`)
      setShowZapModal(false)

    } catch (error) {
      console.log(error)
      toast.error("Problem logging in")
      setShowZapModal(false)
    }

  };

  return (
    <div>
      {loadingState ? ( // Display loading screen when loadingState is true
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        // Display content when loadingState is false
        <div className="flex min-h-screen flex-col items-center justify-center h-max">
          {currentEvent ? ( // Display event content if currentEvent is available
            <>
              <h1>{currentEvent?.tags.find(tag => tag[0] === 'title')?.[1]}</h1>
              <p className='p-6'>Artist Name</p>
              {/* <button
                type='button'
                className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-s-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                onClick={() => setShowCommentSection(true)}
              >
                <EyeIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                <span>Show Comments & Annotations</span>
              </button> */}
             
              <div className='flex flex-row justify-between w-1/2'>
                <button
                  type='button'
                  className='h-10 relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-s-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
                  onClick={() => setShowZapModal(true)}
                >
                  <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                  <span>Zap!</span>
                </button>
                <ZapButton onClick={handleZap} />
                <p className='border-black border p-1 bg-red-200'>No. of Zaps:</p>
              </div>
              <div className='my-10 border border-grey-500 rounded-lg '>
                <ReactMarkdown
                  className='font-mono mx-10 space-y-5'
                  children={currentEvent.content}
                  components={{
                    // Map `h1` (`# heading`) to use `h2`s.
                    h1: 'h2',
                    // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
                    p: ({ node, ...props }) => <div className='border border-grey-500 p-5 cursor-pointer bg-white hover:bg-sky-100' onClick={() => { console.log('Good lyric') }}{...props} />,
                  }}
                />
              </div>
             
            </>
          ) : (
            // Display a message when currentEvent is null
            <p>No event to display.</p>
          )}
        </div>
      )}
      <ZapModal handleCancel={handleCancel} handleZap={handleZap} showZapModal={showZapModal} />
      <ExplorerView showCommentsSection={showCommentSection} handleClose={handleClose} />
    </div>
  );
  
}

export default LyricsView