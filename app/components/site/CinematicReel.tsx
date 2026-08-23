'use client';

import { useEffect, useRef } from 'react';

type CinematicReelProps = {
  src: string;
  poster: string;
  label: string;
};

export default function CinematicReel({ src, poster, label }: CinematicReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const source = sourceRef.current;
    if (!video || !source) return;

    const beginPlayback = () => {
      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || source.src) return;
        source.src = src;
        video.load();
        beginPlayback();
      },
      { rootMargin: '700px 0px' },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return (
    <video
      key={src}
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-label={label}
    >
      <source ref={sourceRef} type="video/mp4" />
    </video>
  );
}
