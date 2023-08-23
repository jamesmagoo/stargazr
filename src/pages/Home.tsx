import React, { useEffect, useState } from 'react'
import { useNDK } from '@nostr-dev-kit/ndk-react';
import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { toast } from 'react-toastify';
import LyricGridComponent from '../components/LyricGridComponent';


const Home = () => {

  const { fetchEvents } = useNDK();
  const [lyricEvents, setLyricEvents] = useState<NDKEvent[]>()
  const [loadingState, setLoadingState] = useState<boolean>(false);

const placeholderImageUrls = [
  "https://placehold.co/600x400/orange/white",
  "https://placehold.co/600x400/blue/white",
  "https://placehold.co/600x400/red/white",
  "https://placehold.co/600x400/yellow/white",
  "https://placehold.co/600x400/green/black",
  "https://placehold.co/600x400/purple/white",
  "https://placehold.co/600x400/black/white",
  "https://placehold.co/600x400/brown/white",
  "https://placehold.co/600x400/orange/white",
];

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * 10);
  return placeholderImageUrls[randomIndex];
};

  const filter: NDKFilter = {
    kinds: [30023],
    "#t": ["lyric", "lyrics"],
  };

  useEffect(() => {
    setLoadingState(true);

    fetchEvents(filter)
      .then((response) => {
        response.map((value, index) => {
          console.log(value, index);
        });
        setLyricEvents(response)
      })
      .catch((err) => {
        toast.error("Error getting lyrics..");
        console.log(err);
        setLyricEvents(undefined)
      })
      .finally(() => {
        setLoadingState(false);
      });
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4'>
      {loadingState === true && <div>Loading...</div>}
      {loadingState === false && lyricEvents?.map((value, index) => (
        <LyricGridComponent event={value} index={index} imageUrl={getRandomImage()} />
      ))}
    </div>

  )
}

export default Home