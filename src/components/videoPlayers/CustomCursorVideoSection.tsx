import { useEffect, useRef, useState } from "react";
import { ClassName } from "../../types";
import VideoPlayer from "./VideoPlayer";

const CustomCursorVideoSection = ({
  title,
  videoUrl,
  className,
}: {
  title?: string;
  videoUrl: string;
} & ClassName) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cursorRef = useRef<HTMLImageElement>(null);
  const [videoClicked, setVideoClicked] = useState(false);
  const [showCustomCursor, setShowCustomCursor] = useState<boolean>(false);

  const handleVideoClick = () => {
    setVideoClicked(!videoClicked);
    const video = videoRef.current;
    const videoContainer = videoContainerRef.current;

    if (!videoClicked) {
      videoContainer?.requestFullscreen().then(() => {
        if (video) {
          video.muted = false;
          video.play().catch((err) => {
            console.error("Failed to play video:", err);
          });
        }

        if (showCustomCursor && cursorRef.current) {
          cursorRef.current.src = "/icons/close-video-circle.svg";
        }
      });
    } else {
      document.exitFullscreen();
      if (video) {
        video.muted = true;
      }
      if (showCustomCursor && cursorRef.current) {
        cursorRef.current.src = "/icons/watch-video-circle.svg";
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch((err) => {
        console.error("Failed to autoplay video:", err);
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1025) {
        setShowCustomCursor(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!showCustomCursor) return;

    const moveImage = (e: MouseEvent) => {
      if (cursorRef.current && videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();

        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 10;
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
      }
    };

    document.addEventListener("mousemove", moveImage);
    return () => {
      document.removeEventListener("mousemove", moveImage);
    };
  }, [showCustomCursor]);

  // hide custom cursor if idle for 5 seconds
  useEffect(() => {
    let timeout: number | null = null;

    const handleIdleCustomCursor = () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      if (!showCustomCursor) {
        setShowCustomCursor(true);
      }

      timeout = setTimeout(() => {
        timeout = null;
        setShowCustomCursor(false);
      }, 5000);
    };

    document.addEventListener("mousemove", handleIdleCustomCursor);
    return () => {
      document.removeEventListener("mousemove", handleIdleCustomCursor);
    };
  }, [showCustomCursor]);

  return (
    <div className={`w-full flex flex-col gap-8 ${className}`}>
      {title && (
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent text-center md:mb-4">
          Why Beautinique is Different
        </h1>
      )}
      {/* Video Section */}
      <div
        className="rounded-3xl overflow-hidden cursor-none shadow-xl shadow-primary-10"
        onClick={handleVideoClick}
        ref={videoContainerRef}
      >
        <div className="flex p-2.5 w-full h-full flex-col items-start self-stretch relative bg-tertiary-inverted border border-tertiary-10 rounded-3xl">
          <VideoPlayer
            className="rounded-xl overflow-hidden"
            ref={videoRef}
            videoProps={{
              onMouseEnter: () => setShowCustomCursor(true),
              playsInline: true,
              autoPlay: true,
              loop: true,
              src: videoUrl,
            }}
          />
          {showCustomCursor && (
            <img
              ref={cursorRef}
              src={
                videoClicked
                  ? "/icons/close-video-circle.svg"
                  : "/icons/watch-video-circle.svg"
              }
              alt="Circle Image"
              className="absolute w-16 h-16 pointer-events-none z-[1] transition-transform animate-spin-slow"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomCursorVideoSection;
