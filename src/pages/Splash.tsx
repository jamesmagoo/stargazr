import { BoltIcon } from '@heroicons/react/20/solid'
import { CheckBadgeIcon, MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftIcon } from '@heroicons/react/24/solid'
import OnBoard from '../components/OnBoard'

type Props = {}

function Splash({ }: Props) {
  const features = [
    {
      name: 'Be Independent',
      description:
        'You own your lyrics, your audience, your comments & favourites.',
      icon: CheckBadgeIcon,
    },
    {
      name: 'Get Together',
      description:
        'Fans & artists share meaning, comment on & celebrate the work.',
      icon: ChatBubbleOvalLeftIcon,
    },
    {
      name: 'Be Real',
      description:
        'Social media "likes" are hollow - real fans & artists "zap"!',
      icon: BoltIcon,
    },
    {
      name: 'Discover',
      description:
        'Explore a vast collection of lyrics. Discover hidden meanings, poetic verses, and the stories behind the lyrics. Save or re-post your favorite lyrics',
      icon: MagnifyingGlassCircleIcon,
    },
  ]

  /**
   * 
   * LANDING PAGE 101 - ANSWER ALL QUESTIONS
   * 
   * 1. what is it 
   * 2. whats in for me ?
   * 3. is it legit?
   * 4. how do i get it?
   */

  /**
   * Dive deep into the world of lyrics, discover hidden gems, and share your interpretations with fellow fans on this ultimate lyrics exploration platform.
   */

  /**
   * Find your favorite artists and engage with them like never before, right here on Stargazr. Our decentralized platform ensures direct communication and supports the industry’s growth.
   */

  return (
    <>
      <div className=" mx-auto w-full flex-grow lg:flex xl:px-8 ">
        <div className="lg:w-1/2 w-full">
          <div className='w-full items-center space-y-4 p-4'>
            <p className='xl:text-5xl lg:text-5xl font-bold'>Where Music Meets Imagination 🌌🎶</p>
            {/* <h1 className='xl:text-6xl lg:text-5xl font-medium'>Fans love them</h1>
            <h1 className='xl:text-6xl lg:text-5xl font-extralight'>Let's explore together</h1> */}
            <p className='font-extralight text-3xl'>Let the stars guide you through an ever-expanding universe of lyrics.</p>
          </div>

          <div className='mt-4 p-4'>
            <dl className="max-w-xl flex flex-col space-y-10 lg:max-w-none p-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-lg font-semibold text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg splash-icon">
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
        <div className='lg:w-1/2 lg:h-auto flex items-center'>
          <OnBoard />
        </div>
        
      </div>
    </>
  )
}

export default Splash