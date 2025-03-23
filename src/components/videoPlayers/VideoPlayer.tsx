import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  width?: string | number;
  height?: string | number;
  onEnded?: () => void;
  poster: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  controls = false,
  width = "640",
  height = "360",
  onEnded,
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;

    if (video) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls!.currentLevel = -1; // Always use Auto Quality

          if (autoPlay) {
            video
              .play()
              .catch((err) => console.warn("Auto-play blocked:", err));
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          if (autoPlay) {
            video
              .play()
              .catch((err) => console.warn("Auto-play blocked:", err));
          }
        });
      }

      const updateProgress = () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          setProgress(percent);
        }
      };

      const handleEnded = () => {
        if (onEnded) onEnded();
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", handleEnded);

      return () => {
        if (hls) hls.destroy();
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [src, autoPlay, onEnded]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        controls={controls}
        muted={isMuted}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        poster={poster}
      />

      {/* Circular Progress */}
      <div
        className="absolute bottom-4 right-4 w-5 h-5 p-0.5 rounded-full bg-gray-200"
        style={{
          background: `conic-gradient(#3b82f6 ${progress}% , #e5e7eb ${progress}% 100%)`,
        }}
      >
        <span className="flex justify-center items-center w-full h-full text-xs font-semibold bg-[red] rounded-full"></span>
      </div>

      {/* Mute Toggle */}
      <div className="absolute bottom-4 left-4 w-12 h-12">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-80"
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
