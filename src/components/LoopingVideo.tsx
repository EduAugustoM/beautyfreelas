"use client";

import { useRef, useEffect } from "react";

interface LoopingVideoProps {
  src: string;
  className?: string;
}

/**
 * Renders a seamlessly looping video by using two video elements that
 * crossfade into each other, avoiding the black frame that browsers
 * produce when rewinding a looped video.
 */
export default function LoopingVideo({ src, className }: LoopingVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  // true = A is active/visible, B is preloaded; false = B is active, A is preloaded
  const isAActive = useRef(true);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB) return;

    // How many seconds before the end we start the crossfade
    const CROSSFADE_OFFSET = 0.5;
    // Duration of the crossfade in seconds (used for the CSS transition)
    const CROSSFADE_DURATION_S = 0.8;

    // Initialise styles
    videoA.style.transition = `opacity ${CROSSFADE_DURATION_S}s ease`;
    videoB.style.transition = `opacity ${CROSSFADE_DURATION_S}s ease`;
    videoA.style.opacity = "1";
    videoB.style.opacity = "0";

    let swapping = false;

    const handleTimeUpdate = () => {
      const active = isAActive.current ? videoA : videoB;
      const next = isAActive.current ? videoB : videoA;

      if (!active.duration || swapping) return;

      const timeLeft = active.duration - active.currentTime;

      if (timeLeft <= CROSSFADE_OFFSET) {
        swapping = true;

        // Make sure the next video is ready at the beginning
        next.currentTime = 0;
        next.play().catch(() => {});

        // Crossfade
        active.style.opacity = "0";
        next.style.opacity = "1";

        // After the transition completes, pause the old video and reset
        setTimeout(() => {
          active.pause();
          active.currentTime = 0;
          isAActive.current = !isAActive.current;
          swapping = false;
        }, CROSSFADE_DURATION_S * 1000);
      }
    };

    videoA.addEventListener("timeupdate", handleTimeUpdate);
    videoB.addEventListener("timeupdate", handleTimeUpdate);

    // Kick off playback
    videoA.play().catch(() => {});

    return () => {
      videoA.removeEventListener("timeupdate", handleTimeUpdate);
      videoB.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const sharedProps = {
    src,
    muted: true as const,
    playsInline: true as const,
    preload: "auto" as const,
    style: { position: "absolute" as const, inset: 0, width: "100%", height: "100%" },
    className,
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video ref={videoARef} {...sharedProps} />
      <video ref={videoBRef} {...sharedProps} />
    </div>
  );
}
