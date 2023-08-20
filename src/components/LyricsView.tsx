import { useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { BoltIcon } from '@heroicons/react/20/solid';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import ZapModal from '../components/ZapModal'
import LoginModal from './LoginModal';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';



type Props = {}

const LyricsView = (props: Props) => {

  const { signPublishEvent } = useNDK();
  const [showZapModal, setShowZapModal] = useState(false);
  const { user, login, logout } = useUser();


  const handleCancel = () => {
    setShowZapModal(false);
  };

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

    const lyricsEvent = {
        "id": "04d03336271abc1dcd8a3e9bd7bfc66fda96bf324d00784091d6ef8476988e65",
        "pubkey": "7f4f672af0cb2e9263f525d68f3043c05c1e7a1ade5aaf4b89afc400c184579e",
        "created_at": 1692341604,
        "kind": 30023,
        "tags": [
          [
            "d",
            "0edc4ca8"
          ],
          [
            "summary",
            "Testing a new idea"
          ],
          [
            "published_at",
            "1692341604"
          ],
          [
            "t",
            "lyrics"
          ],
          [
            "title",
            "Tranquility Base Hotel & Casino"
          ]
        ],
        "content": "Jesus in the day spa  \nFilling out the information form  \nMama got her hair done  \nJust popping out to sing a protest song  \nI've been on a bender back to that prophetic esplanade  \nWhere I ponder all the questions  \nBut just manage to miss the mark, hoo-hoo\n\nGood afternoon  \nTranquility Base Hotel and Casino  \nMark speaking  \nPlease tell me how may I direct your call?\n\nThis magical thinking  \nFeels as if it really might catch on  \nMama wants some answers  \nDo you remember where it all went wrong?  \nTechnological advances  \nReally bloody get me in the mood  \nPull me in close on a crisp eve, baby  \nKiss me underneath the moon's side boob\n\nGood afternoon  \nTranquility Base Hotel and Casino  \nMark speaking  \nPlease tell me how may I direct your call?\n\nAnd do you celebrate your dark side  \nAnd then wish you'd never left the house?  \nHave you ever spent a generation  \nTrying to figure that one out?\n\nHoo-hoo  \nGood afternoon  \nTranquility Base Hotel and Casino  \nMark speaking  \nPlease tell me how may I direct your call?\n\n#lyrics ",
        "sig": "691ed3184579283ed05108cbfbb3a724f62bac0117c84e0e77d90fb2528e905844a48c89e86d48e61578b6be30a3d0cbedc3611b1a525a15fe152c1509526fa3"
      } 
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center h-max">
        
        <h1>{lyricsEvent.tags.find(tag => tag[0] === 'title')?.[1]}</h1>
        <p>Arctic Monkeys</p>

        <div className='my-10 border border-grey-500 rounded-lg '>
          <ReactMarkdown
            className='font-mono mx-10 space-y-5'
            children={lyricsEvent.content}
            components={{
              // Map `h1` (`# heading`) to use `h2`s.
              h1: 'h2',
              // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
              p: ({ node, ...props }) => <div className='border border-grey-500 p-5 cursor-pointer bg-white hover:bg-sky-100' onClick={() => { console.log('Good lyric') }}{...props} />,
              //p: ({node, ...props}) => <MyFancyRule {...props} />
            }}
          />
        </div>
        <div className='flex flex-row justify-between w-1/2'>
          <button
            type='button'
            className='relative inline-flex items-center px-2 py-1 md:px-4 md:py-2 border border-black shadow-s-medium rounded-md text-black bg-yellow-500 hover:bg-yellow-200'
            onClick={() => setShowZapModal(true)}
          >
            <BoltIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
            <span>Zap!</span>
          </button>
          <p className='border-black border p-1 bg-red-200'>No. of Zaps:</p>
        </div>
      </div>
      <ZapModal handleCancel={handleCancel} handleZap={handleZap} showZapModal={showZapModal} />
    </div>
  )
}

export default LyricsView