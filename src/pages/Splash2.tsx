import { BoltIcon, ChartBarIcon, FireIcon, MusicalNoteIcon , EyeIcon} from '@heroicons/react/20/solid'
import { PuzzlePieceIcon, StarIcon } from '@heroicons/react/24/outline'
// import OnBoard from '../components/OnBoard'
import { useNavigate } from 'react-router-dom'
import SplashCarousel from '../components/SplashCarousel'
import { useEffect, useState } from "react";
import { NDKFilter } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { toast } from 'react-toastify';
import { useEvent } from '../context/EventContext';
import Loading from './Loading';


/**
   * 
   * LANDING PAGE 101 - ANSWER ALL QUESTIONS
   * 
   * 1. what is it 
   * 2. whats in for me ?
   * 3. is it legit?
   * 4. how do i get it?
   * 
   * 
   * 
   */
const fanFeatures = [
  {
    name: 'Connect & Celebrate 🎉',
    description:
      'Connect with artists and fellow fans to share your passion for music. Engage in meaningful conversations, comment on your favorite lyrics, and celebrate the artistry together.',
    icon: MusicalNoteIcon,
  },
  {
    name: 'Authentic Interactions ⚡',
    description:
      'Say goodbye to superficial "likes" – here, genuine fans and artists share the love with a Zap. Real, electric connections that light up your music experience.',
    icon: FireIcon,
  },
  {
    name: 'A Lyrical Universe Unveiled 🌌',
    description:
      'Dive into an expansive world of lyrics. Unearth hidden meanings, poetic verses, and the fascinating stories behind the songs. Save and share your most beloved lyrics.  Add friends and see theirs! 😍',
    icon: PuzzlePieceIcon,
  },
]

const artistFeatures = [
  {
    name: 'Independence 🎸',
    description:
      'No more platform lock-in; share your music, lyrics, and stories directly with fans. If you leave - all your lyrics, fans, & interactions go with you.',
    icon: StarIcon,
  },
  {
    name: 'Value for Value 🤝',
    description:
      'Tap into the lightning-fast Bitcoin Lightning Network to receive direct fan support with a simple "zap." Stargazr empowers artists & fans to give back to one another',
    icon: BoltIcon,
  },
  {
    name: 'Captivate Your Audience 💜 ',
    description:
      'With Stargazr on the Nostr network, your fanbase stays with you across all Nostr apps. Cultivate unwavering loyalty by engaging fans with content, zapping interpretations, and live interactions.',
    icon: ChartBarIcon,
  },
]


function Splash2() {

  const navigate = useNavigate()

  const { fetchEvents, ndk } = useNDK();
  const { ndkEvents , setNDKEvents } = useEvent();
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const filter: NDKFilter = {
    kinds: [30023],
    "#t": ["lyrics","lyrics"],
  };

  useEffect(() => {
    setLoadingState(true);
    console.log("loading lyrics")
    fetchEvents(filter)
      .then((response) => {
        setNDKEvents(response);
      })
      .catch((err) => {
        toast.error("Error getting lyrics..");
        console.log(err);
        setNDKEvents(null);
      })
      .finally(() => {
        setLoadingState(false);
      });
  }, [ndk]);

  return (
    <>
      <div 
      className="mx-auto w-full flex-grow lg:flex xl:px-8 justify-center"
      >

        <div className='flex-col items-center flex justify-center'>
          <div className='xl:text-7xl lg:text-6xl md:text-5xl text-5xl font-bold mt-48 text-center balance-card text-white'> Explore lyrics, interpretations &</div>
          <div className='xl:text-7xl lg:text-6xl md:text-5xl text-5xl font-bold mb-8 text-center text-white'> connect with other fans 🌌</div>
          {/* <p className='font-extralight text-3xl'>Let the stars guide you through an ever-expanding universe of lyrics 🌌 🔭</p> */}
          <p className=' lg:text-2xl md:text-2xl text-base w-2/3 mb-4 text-center balance-card text-slate-100'>Dive deeper into the world of music. Uncover the stories behind your favorite songs, <span  className='font-extrabold bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 text-transparent bg-clip-text'>share your interpretations</span>, and connect with a vibrant <span className='font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text'>community of music lovers.</span></p>
          {/* <div>
            <img src={logo} className='h-36 w-auto flex' />
          </div> */}
          <div className='mt-36 mb-36'>
            <button 
            onClick={()=>{navigate("lyrics")}}
            className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2">
              <>
                <EyeIcon className="w-5 h-5 inline-block mr-2 hover:text-yellow-500" />
                <span className='text-white hover:text-black'>Start Exploring</span>
              </>
            </button>
          </div>


          {loadingState === true && <div key={1}><Loading/></div>}
          {loadingState === false && 
            <SplashCarousel 
            ndkEvents={ndkEvents} 
           />
          }

          <div className='flex flex-row w-screen mt-10 mb-12 justify-between'>
            <div className='w-full flex flex-col items-center mx-6'>
              <div className='font-extrabold text-3xl text-white'>Fans 🤘</div>
              <dl className="max-w-xl flex flex-col space-y-5 lg:max-w-none p-4">
                {fanFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-lg font-semibold text-white">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg splash-icon border-black border-2">
                        <feature.icon className="h-6 w-6  text-white" aria-hidden="true" />
                      </div>
                      <p>{feature.name}</p>
                    </dt>
                    <dd className="text-base text-gray-400">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* <OnBoard /> */}

            <div className='gradient w-full flex flex-col items-center mx-6'>
              <div className='font-extrabold text-3xl text-white'>Artists 🎤</div>
              <dl className="max-w-xl flex flex-col space-y-10 lg:max-w-none p-4">
                {artistFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-lg font-semibold text-white">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg splash-icon  border-black border-2">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <p>{feature.name}</p>
                    </dt>
                    <dd className="text-base text-gray-400">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default Splash2