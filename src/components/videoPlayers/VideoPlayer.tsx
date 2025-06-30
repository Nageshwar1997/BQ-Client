import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  autoPlay?: boolean;
  controls?: boolean;
  isMuted?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const VideoPlayer = ({
  videoUrl,
  posterUrl = "",
  controls = false,
  autoPlay = true,
  className = "",
  isMuted = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;
    if (!video) return;
    video.muted = isMuted;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video
            .play()
            .catch((err) => console.warn("Autoplay blocked (HLS):", err));
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoUrl;
      video.addEventListener("loadedmetadata", () => {
        if (autoPlay) {
          video
            .play()
            .catch((err) => console.warn("Autoplay blocked (native):", err));
        }
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl, autoPlay, isMuted]);

  return (
    <div className={`relative w-full h-full aspect-video ${className}`}>
      <video
        ref={videoRef}
        controls={controls}
        muted={isMuted}
        className="object-cover w-full h-full"
        poster={posterUrl}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
