import { BoltIcon } from '@heroicons/react/20/solid';
import { NDKEvent, NDKUserProfile, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { bech32 } from "bech32";
import { utils } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestProvider } from 'webln';
import ZapModal from '../components/ZapModal';
import { useEvent } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import ExplorerView from '../pages/ExplorerView';
import ZapButton from './ZapButton';


const LyricsView = () => {

  const { event, ndkEvents } = useEvent();
  const { eventID } = useParams()

  const [nodeInfo, setNodeInfo] = useState('');
  const [webln, setWebln] = useState<any>('');
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [currentEvent, setCurrentEvent] = useState<NDKEvent | null>(null)
  const [showZapModal, setShowZapModal] = useState(false);
  const [showCommentSection, setShowCommentSection] = useState(false)
  const { getUser, ndk } = useNDK();
  const { user } = useUser();

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
  }, [eventID]);


  useEffect(() => {
    async function loadRequestProvider() {
      try {
        const webln = await requestProvider();
        const nodeInfo = await webln.getInfo();
        setNodeInfo(nodeInfo.node.alias);
        setWebln(webln)
        console.log(`Connected to LN ⚡️ node info : ${nodeInfo.node.alias}`)
      } catch (err) {
        console.log(err)
        console.log("Error connecting to webln")
      }
    }
    loadRequestProvider();
  }, [])

  const handleCancel = () => {
    setShowZapModal(false);
  };

  const handleClose = () => {
    setShowCommentSection(false)
  }

  // TODO fix this, need to pass correct event through to zap....
  const handleZap = async () => {
    try {
      if (user) {
        console.log(`User logged in we can zap.. ${user.npub}`)
        // make  zap request
        const sender = user.npub;
        const sats = 21;
        const amount = sats * 1000
        // TODO fill this in
        const comment = "I just wanted to be one of The Strokes..."
        if(currentEvent !== null){
          let result = await getZapRequest(currentEvent, sender, amount, comment);
          if(result){
            toast.success("⚡️ ZAP !")
          } else {
            toast.error("Problem zapping 🫠 ")
          }
        }
      } else {
        console.log("no user ")
        toast.error("Please login with our wallet")
      }
      setShowZapModal(false)

    } catch (error) {
      console.log(error)
      toast.error("Problem logging in")
      setShowZapModal(false)
    }

  };

  const getZapRequest = async (note: NDKEvent, sender: string, amount: number, comment: string) => {

    // get the recipients lnurls from their profile..
    let author = getUser(note.pubkey)
    await author.fetchProfile()
    console.log("author profile:", author)    
    const callback = await getZapEndpoint(author.profile);
    console.log("got a callback", callback)

    if (callback == null) {
      return false;
    }

  const sats = Math.round(amount);

  const zapReq: NostrEvent = {
    kind: 9734,
    pubkey: user.npub,
    created_at: Math.round(Date.now() / 1000),
    content: comment,
    tags: [
      ["p", note.pubkey],
      // e - is an optional hex-encoded event id. Clients MUST include this if zapping an event rather than a person
      // TODO : implement this e tag  
      ["e", "tag reference"],
      ["amount", String(sats)],
      ["relays", "ws://127.0.0.1:8080"],
      // TODO : implement lnurl py url of recipient 
      ["lnurl", String(author.profile?.lud16) ]
    ],
  };

      let zapRequestEvent = new NDKEvent(ndk, zapReq)
      let signedEvent = zapRequestEvent.sign()

  try {
    const event = encodeURI(JSON.stringify(signedEvent));
    const r2 = await (await fetch(`${callback}?amount=${sats}&nostr=${event}`)).json();
    const pr = r2.pr; // invoice
    if (webln !== null) {
    await webln.sendPayment(pr);
    } else { 
      return false;
    }
    return true;
  } catch (reason) {
    console.error('Failed to zap: ', reason);
    toast.error("Failed to zap!")
    return false;
  }


  }

  const getZapEndpoint = async (user: NDKUserProfile): Promise<string | null>  => {
    try {
      let lnurl: string = ''

      let {lud06, lud16} = user;
  
      if (lud16) {
        console.log("lud16 found")
        let [name, domain] = lud16.split('@')
        lnurl = `https://${domain}/.well-known/lnurlp/${name}`
        console.log(lnurl)
      }
      else if (lud06) {
        console.log("lud06 found")
        let {words} = bech32.decode(lud06, 1023)
        let data = bech32.fromWords(words)
        lnurl = utils.utf8Decoder.decode(data)
      }
      else {
        return null;
      }
  
      let res = await fetch(lnurl)
      let body = await res.json()
  
      if (body.allowsNostr && body.nostrPubkey) {
        return body.callback;
      }
    } catch (err) {
      console.log('E: ', err);
      return null;
      /*-*/
    }
  
    return null;
  }

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
     <ZapModal handleCancel={handleCancel} handleZap={handleCancel} showZapModal={showZapModal} />
      <ExplorerView showCommentsSection={showCommentSection} handleClose={handleClose} />
    </div>
  );

}

export default LyricsView