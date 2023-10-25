import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import LyricGridComponent from '../components/LyricGridComponent';
import { useEvent } from '../context/EventContext';
import Loading from './Loading';


const Home = () => {

  const { fetchEvents, ndk } = useNDK();
  const { ndkEvents , setNDKEvents } = useEvent();
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const getBackgroundImage = (event : NDKEvent) =>{
    let imageUrlfound = event.tags.find((tag) => tag[0] === 'image')?.[1]
    if(imageUrlfound != undefined && imageUrlfound?.length > 0 ){
        return imageUrlfound
    } else {
        return getRandomImage()
    }
}

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * 22) + 1;
    return `/placeholders/placeholder-${randomIndex}.png`;
  };

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

  // TODO figure out how to stop relaoding events everytime in above useEffect...
  // useEffect(() => {
  //   if (!ndkEvents) {
  //     console.log("No events in context")
  //     setLoadingState(true);
  //     fetchEvents(filter)
  //       .then((response) => {
  //         setNDKEvents(response);
  //       })
  //       .catch((err) => {
  //         toast.error("Error getting lyrics..");
  //         console.log(err);
  //         setNDKEvents(null);
  //       })
  //       .finally(() => {
  //         setLoadingState(false);
  //       });
  //   }
  // }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 h-auto'>
      {loadingState === true && <div key={1}><Loading/></div>}
      {loadingState === false && ndkEvents?.map((value, index) => (
        <LyricGridComponent event={value} key={index} imageUrl={getBackgroundImage(value)} />
      ))}
    </div>

  )
}

export default Home