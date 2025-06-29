import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import waterAnim from '../assets/watering.json';

export default function WateringFlash({ trigger }) {
  const [play, setPlay] = useState(false);

  // play the animation whenever trigger value changes
  useEffect(() => { setPlay(true); }, [trigger]);

  if (!play) return null;
  return (
    <Lottie
      animationData={waterAnim}
      key={trigger}           // force replay
      className="fixed bottom-6 right-6 w-28 pointer-events-none"
      onComplete={() => setPlay(false)}
    />
  );
}
