import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { IVideoPlayer } from "../../types";
import { convertVideoToPoster } from "../../utils";

const VideoPlayer = ({ className = "", videoProps = {} }: IVideoPlayer) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [poster, setPoster] = useState<string | undefined>(videoProps.poster);

  useEffect(() => {
    let isMounted = true;

    const loadPoster = async () => {
      if (videoProps.src && !videoProps.poster) {
        const p = await convertVideoToPoster(videoProps.src);
        if (isMounted) setPoster(p);
      }
    };

    loadPoster();
    return () => {
      isMounted = false;
    };
  }, [videoProps.src, videoProps.poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoProps.src || !videoProps.src.endsWith(".m3u8")) return;
    let hls: Hls | null = null;

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
        poster={poster}
      />
    </div>
  );
};

export default VideoPlayer;
