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

  return (
    <>
      <div className=" mx-auto w-full flex-grow lg:flex xl:px-8 ">
        <div className="lg:w-1/2 w-full">
          <div className='w-full items-center space-y-4 p-4'>
            <p className='lg:text-6xl text-5xl font-bold'>Artists give us lyrics.</p>
            <h1 className='lg:text-6xl text-5xl font-medium'>Fans love them.</h1>
            <h1 className='lg:text-6xl text-5xl font-extralight'>Let's get together.</h1>
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
        <div className='lg:w-1/2 lg:h-screen'>
          <OnBoard />
        </div>
        
      </div>
    </>
  )
}

export default Splash