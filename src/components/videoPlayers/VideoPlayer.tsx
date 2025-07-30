import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { IVideoPlayer } from "../../types";

const VideoPlayer = ({ className = "", videoProps = {} }: IVideoPlayer) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;
    if (!video || !videoProps.src) return;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoProps.src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoProps.autoPlay) {
          video
            .play()
            .catch((err) => console.warn("Autoplay blocked (HLS):", err));
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoProps.src;
      video.addEventListener("loadedmetadata", () => {
        if (videoProps.autoPlay) {
          video
            .play()
            .catch((err) => console.warn("Autoplay blocked (native):", err));
        }
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoProps]);

  return (
    <div className={`w-full h-full ${className}`}>
      <video
        ref={videoRef}
        {...videoProps}
        playsInline={videoProps.playsInline ?? true}
        autoPlay={videoProps.autoPlay ?? true}
        muted={videoProps.muted ?? true}
        loop={videoProps.loop ?? false}
        controls={videoProps.controls ?? false}
        className={`object-cover aspect-auto w-full h-full ${
          videoProps.className ?? ""
        }`}
      />
    </div>
  );
};

export default VideoPlayer;
