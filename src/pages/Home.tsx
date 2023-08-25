import React, { useEffect, useState } from 'react'
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { toast } from 'react-toastify';
import LyricGridComponent from '../components/LyricGridComponent';
import { useEvent } from '../context/EventContext';


const Home = () => {

  const { fetchEvents, ndk } = useNDK();
  const { ndkEvents , setNDKEvents } = useEvent();
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * 22) + 1;
    return `/placeholders/placeholder-${randomIndex}.png`;
  };

  const filter: NDKFilter = {
    kinds: [30023],
    "#t": ["lyric", "lyrics"],
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
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
      {loadingState === true && <div key={1}>Loading...</div>}
      {loadingState === false && ndkEvents?.map((value, index) => (
        <LyricGridComponent event={value} key={index} imageUrl={getRandomImage()} />
      ))}
    </div>

  )
}

export default Home