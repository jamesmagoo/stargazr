import { BoltIcon, ChartBarIcon, FireIcon, MusicalNoteIcon , EyeIcon} from '@heroicons/react/20/solid'
import { PuzzlePieceIcon, StarIcon } from '@heroicons/react/24/outline'
import OnBoard from '../components/OnBoard'
import { useNavigate } from 'react-router-dom'

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

  return (
    <>
      <div 
      className="mx-auto w-full flex-grow lg:flex xl:px-8 justify-center"
      // style={{ backgroundImage: `url('${backgroundImagery}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >

        <div className='flex-col items-center flex justify-center'>
          <div className='xl:text-7xl lg:text-6xl md:text-5xl text-5xl font-bold mt-48 text-center balance-card'> Explore lyrics, interpretations &</div>
          <div className='xl:text-7xl lg:text-6xl md:text-5xl text-5xl font-bold mb-8 text-center'> connect with other fans 🌌</div>
          {/* <p className='font-extralight text-3xl'>Let the stars guide you through an ever-expanding universe of lyrics 🌌 🔭</p> */}
          <p className=' lg:text-base md:text-base text-base w-1/2 mb-4 text-center balance-card text-slate-600'>Dive deeper into the world of music. Uncover the stories behind your favorite songs, share your interpretations, and connect with a vibrant <span className='font-bold'>community of music lovers.</span></p>
          {/* <div>
            <img src={logo} className='h-36 w-auto flex' />
          </div> */}
          <div className='mt-36 mb-64'>
            <button 
            onClick={()=>{navigate("lyrics")}}
            className="cursor cursor-pointer hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2">
              <>
                <EyeIcon className="w-5 h-5 inline-block mr-2 hover:text-yellow-500" />
                <span className='text-white hover:text-black'>Start Exploring</span>
              </>
            </button>
          </div>

          <div className='flex flex-row w-screen mt-10 mb-12 justify-between'>
            <div className='w-full flex flex-col items-center mx-6'>
              <div className='font-extrabold text-3xl'>Fans 🤘</div>
              <dl className="max-w-xl flex flex-col space-y-5 lg:max-w-none p-4">
                {fanFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-lg font-semibold text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg splash-icon border-black border-2">
                        <feature.icon className="h-6 w-6 text-black" aria-hidden="true" />
                      </div>
                      <p>{feature.name}</p>
                    </dt>
                    <dd className="text-base text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <OnBoard />

            <div className='w-full flex flex-col items-center mx-6'>
              <div className='font-extrabold text-3xl'>Artists 🎤</div>
              <dl className="max-w-xl flex flex-col space-y-10 lg:max-w-none p-4">
                {artistFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-lg font-semibold text-gray-900">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg splash-icon  border-black border-2">
                        <feature.icon className="h-6 w-6 text-black" aria-hidden="true" />
                      </div>
                      <p>{feature.name}</p>
                    </dt>
                    <dd className="text-base text-gray-600">{feature.description}</dd>
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