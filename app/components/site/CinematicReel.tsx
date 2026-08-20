'use client';

import { useEffect, useRef } from 'react';

type CinematicReelProps = {
  src: string;
  poster: string;
  label: string;
};

export default function CinematicReel({ src, poster, label }: CinematicReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const beginPlayback = () => {
      void video.play().catch(() => undefined);
    };

    beginPlayback();
    video.addEventListener('canplay', beginPlayback);
    document.addEventListener('visibilitychange', beginPlayback);

    return () => {
      video.removeEventListener('canplay', beginPlayback);
      document.removeEventListener('visibilitychange', beginPlayback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
