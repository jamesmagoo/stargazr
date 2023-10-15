import Carousel from 'react-spring-3d-carousel';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { config } from "react-spring";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';


type Props = {
    ndkEvents: NDKEvent[] | null;
}

function SplashCarousel({ ndkEvents }: Props) {

    const navigate = useNavigate();

    const getBackgroundImage = (event: NDKEvent) => {
        let imageUrlfound = event.tags.find((tag) => tag[0] === 'image')?.[1]
        if (imageUrlfound != undefined && imageUrlfound?.length > 0) {
            return imageUrlfound
        } else {
            return getRandomImage()
        }
    }

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * 22) + 1;
        return `/placeholders/placeholder-${randomIndex}.png`;
    };

    const [offsetRadius,] = useState(4);
    const [goToSlide, setGoToSlide] = useState(0);

    const [slides, ] = useState(ndkEvents?.map((value, index) => ({
        key: index,
        onClick: () => setGoToSlide(index),
        content:
            <div
                className="w-96 h-96 relative border border-black rounded-lg shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                style={{
                    backgroundImage: `url(${getBackgroundImage(value)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-20% to-black to-90%"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <h2 
                    onClick={()=>{navigate(`lyrics/lyric/${value.id}`)}}
                    className="text-xl mb-2 font-semibold hover:cursor-pointer hover:text-indigo-500">
                        {value.tags.find((tag) => tag[0] === 'title')?.[1]}
                    </h2>
                    <p className="text-white line-clamp-4 italic">
                    <ReactMarkdown
                  className='space-y-2'
                  children={value.content}/>
                    </p>
                </div>
            </div>
        ,
    })));

    return (
        <div className='w-full h-96 mb-36'>
            <Carousel
                slides={slides || []}
                offsetRadius={offsetRadius}
                showNavigation={false}
                goToSlide={goToSlide}
                animationConfig={config.gentle}
            />
        </div>
    )
}

export default SplashCarousel




