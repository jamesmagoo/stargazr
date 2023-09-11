import { NDKKind, NDKEvent, NDKUserProfile, NostrEvent } from '@nostr-dev-kit/ndk';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { bech32 } from "bech32";
import { utils } from 'nostr-tools';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { toast } from 'react-toastify';
import { requestProvider } from 'webln';
import ZapModal from '../components/ZapModal';
import { useEvent } from '../context/EventContext';
import { useUser } from '../context/UserContext';
import Loading from '../pages/Loading';
import ZapButton from './ZapButton';
//@ts-ignore
import { decode } from "light-bolt11-decoder";


type Props = {
  eventID: string | undefined;
  event: NDKEvent | undefined | null;
}

const LyricsView = ({ eventID }: Props) => {

  const { ndkEvents } = useEvent();

  const [, setNodeInfo] = useState('');
  const [webln, setWebln] = useState<any>('');
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [currentEvent, setCurrentEvent] = useState<NDKEvent | null>(null)
  const [showZapModal, setShowZapModal] = useState(false);
  const [zapLoading, setZapLoading] = useState(false)
  const { ndk } = useNDK();
  const { user } = useUser();

  useEffect(() => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Oper
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
        console.log("Error connecting to webln")
      }
    }
    loadRequestProvider();
  }, [])

  const handleCancel = () => {
    setShowZapModal(false);
    setZapLoading(false)
  };

  // TODO fix this, need to pass correct event through to zap....
  const handleZap = async (zapMessage: string, zapAmount : number) => {
    setZapLoading(true)
    try {
      if (user) {
        console.log(`User logged in we can zap.. ${user.npub}`)
        // make  zap request
        const sats = zapAmount;
        const amount = sats * 1000
        let comment; 
        if(zapMessage !== null && zapMessage !== undefined && zapMessage.length >0){
          comment = zapMessage
        } else {
          comment = "brought to you by stargazr.xyz"
        }
        if (currentEvent !== null) {
          let result = await getZapRequest(currentEvent, amount, comment);
          console.log(result)
          if (result) {
            setZapLoading(false)
            toast.success("⚡️ ZAP !")
          } else {
            setZapLoading(false)
            toast.error("Problem zapping 🫠 ")
            toast.info("Are you sure you've installed Alby?")
          }
        }
      } else {
        console.log("no user ")
        toast.error("Please login")
      }
      setZapLoading(false)
      setShowZapModal(false)

    } catch (error) {
      console.log(error)
      toast.error("Problem logging in")
      setZapLoading(false)
      setShowZapModal(false)
    }

  };

  const getZapRequest = async (note: NDKEvent, amount: number, comment: string) => {
    let author = ndk?.getUser({ hexpubkey: `${note.pubkey}` })
    await author?.fetchProfile();
    let callback;
    if (author?.profile != undefined) {
      callback = await getZapEndpoint(author.profile);
      console.log("got a callback", callback)
      if (callback == null) {
        return false;
      }
    } else {
      toast.error("This author cannot recieve zaps! ")
      return false;
    }
    const sats = Math.round(amount);
    let eventDescription;
    const relayObject = JSON.parse(import.meta.env.VITE_APP_relays);

    if (user) {
      const zapReq: NostrEvent = {
        kind: 9734,
        pubkey: user.hexpubkey(),
        created_at: Math.round(Date.now() / 1000),
        content: comment,
        tags: [
          ["p", note.pubkey],
          ["e", note.id],
          ["amount", String(sats)],
          ["relays"],
          ["lnurl", callback]
        ],
      };

      // Iterate through the string array and add its elements to the "relays" array
      for (const item of relayObject) {
        zapReq.tags[3].push(item);
      }

      let zapRequestEvent = new NDKEvent(ndk, zapReq)
      await zapRequestEvent.sign(ndk?.signer)
      eventDescription = JSON.stringify(zapRequestEvent.rawEvent());
    }
    try {
      const event = encodeURI(eventDescription ? eventDescription : "");
      console.log("calling callback...")
      // const r2 = await (await fetch(`${callback}?amount=${sats}&nostr=${event}`)).json();
      // const pr = r2.pr; // invoice
      // console.log(pr)
      let callbackUrl = `${callback}?amount=${sats}&nostr=${event}`
      const timeoutDuration = 12000; // 12 seconds 
      let response: any;
      let data;
      try {
        //response = await fetch(`${callback}?amount=${sats}&nostr=${event}`);

        response = await Promise.race([
          fetch(callbackUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Fetch timeout')), timeoutDuration))
        ]);

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }

        data = await response.json();
        console.log(`Invoice recieved: ${data.pr}`);
      } catch (error) {
        console.error(error);
        return false
      }

      let decodedInvoice = decode(data.pr);
      if (webln !== null) {
        let res = await webln.sendPayment(data.pr);
        console.log(res)
        let preimage = res.preimage;
        console.log("publishing zap receipt")
        await publishZapReceipt(eventDescription, decodedInvoice, preimage, note)

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

  const getZapEndpoint = async (user: NDKUserProfile): Promise<string | null> => {
    try {
      let lnurl: string = ''

      let { lud06, lud16 } = user;

      if (lud16) {
        console.log("lud16 found")
        let [name, domain] = lud16.split('@')
        lnurl = `https://${domain}/.well-known/lnurlp/${name}`
        console.log(lnurl)
      }
      else if (lud06) {
        console.log("lud06 found")
        let { words } = bech32.decode(lud06, 1023)
        let data = bech32.fromWords(words)
        lnurl = utils.utf8Decoder.decode(new Uint8Array(data))
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

  const publishZapReceipt = async (eventDescription: string | undefined, decodedInvoice: any, preimage: string, note: NDKEvent) => {
    console.log("got the goods", eventDescription)
    const timestampSection = decodedInvoice.sections.find(
      (s: any) => s.name === "timestamp"
    );

    const zapReceiptevent = new NDKEvent(ndk);

    let tags = [
      ["p", note.pubkey],
      ["e", note.id],
      ["description", eventDescription],
      ["preimage", preimage],
      ["bolt11", decodedInvoice.paymentRequest]
    ]

    zapReceiptevent.kind = NDKKind.Zap;
    zapReceiptevent.content = "";
    zapReceiptevent.created_at = timestampSection.value,
      zapReceiptevent.tags = tags
    await zapReceiptevent.sign()
    console.log(zapReceiptevent)
    try {
      await zapReceiptevent.publish();
    } catch (err) {
      console.log(err)
    }
  }

  const getImage = () => {
    let providedImageURL = currentEvent?.tags.find(tag => tag[0] === 'image')?.[1]
    if (providedImageURL !== null && providedImageURL !== undefined && providedImageURL?.length > 0) {
      return providedImageURL;
    } else {
      const randomIndex = Math.floor(Math.random() * 22) + 1;
      return `/placeholders/placeholder-${randomIndex}.png`;
    }

  };

  return (
    <div>
      {loadingState ? ( // Display loading screen when loadingState is true
        <Loading />
      ) : (
        // TODO : make this tow rows, title & author on top, buttons and stats below
        <div className="flex flex-col justify-center items-center">
          {currentEvent ? ( // Display event content if currentEvent is available
            <>
              <div className='flex items-center justify-center w-full p-4 rounded-lg h-48 border border-slate-400'
                style={{ backgroundImage: `url('${getImage()}')`, position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              </div>
              <div className='flex items-center justify-center w-full h-24 p-4 rounded-lg' >
                <div className='flex flex-col items-center'>
                  <p className='border border-black rounded-xl text-center text-sm md:text-4xl lg:text-4xl xl:text-4xl font-bold line-clamp-2 backdrop-blur-lg p-2 text-y'>{currentEvent?.tags.find(tag => tag[0] === 'title')?.[1]}</p>
                  {/* TODO - get the profile of artist using the event npub?? */}
                  <p className='text-sm'>{currentEvent.author.profile ? currentEvent.author.profile?.displayName : "Artist"}</p>
                  <ZapButton onClick={() => setShowZapModal(true)} />
                </div>
              </div>

              <div className='my-10 mx-10 rounded-lg bg-white shadow-2xl font-light w-4/5 '>
                <ReactMarkdown
                  className='mx-10 space-y-2'
                  children={currentEvent.content}
                  components={{
                    // Map `h1` (`# heading`) to use `h2`s.
                    h1: 'h2',
                    // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
                    p: ({ node, ...props }) => <div className='p-5 cursor-pointer bg-white text-lg' onClick={() => { console.log('Good lyric') }}{...props} />,
                  }}
                />
              </div>

              <div className='flex items-center justify-center w-full h-24 p-4' >
                {/* TODO implement reactions, sharing, zap counts, view counts */}
                {/* <button
                    type="button"
                    className="flex items-center h-10  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                    onClick={() => setShowZapModal(true)}
                  >
                    <div className="flex items-center">
                      <span className="mr-1">Zaps</span>
                      <span className="text-lg">⚡️</span>
                      <span className="ml-1">{numberOfZaps}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center h-10  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                  >
                    <HeartIcon className="w-5 h-5 inline-block mr-2" />
                    Like
                  </button>
                  <button
                    type="button"
                    className="flex items-center h-10  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                  >
                    <ShareIcon className="w-5 h-5 inline-block mr-2" />
                    Share
                  </button> */}

                <ZapButton onClick={() => setShowZapModal(true)} />

              </div>
            </>
          ) : (
            // Display a message when currentEvent is null
            <p>No event to display.</p>
          )}
        </div>
      )}
      <ZapModal handleCancel={handleCancel} handleZap={handleZap} showZapModal={showZapModal} zapLoading={zapLoading} />
    </div>
  );

}

export default LyricsView