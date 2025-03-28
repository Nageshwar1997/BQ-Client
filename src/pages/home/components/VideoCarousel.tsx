import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import {
  LeftArrowIcon,
  RightArrowIcon,
  VolumeMaxIcon,
  VolumeMuteIcon,
} from "../../../icons";
import { useGetHomeVideos } from "../../../api/media/media.service";
import ShowError from "../../../components/errors/ShowError";

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const { data, isLoading, isError } = useGetHomeVideos();
  const videos = data?.videos;

  const handlePrev = useCallback(() => {
    if (!videos || videos.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  }, [videos]);

  const handleNext = useCallback(() => {
    if (!videos || videos.length === 0) return;
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  }, [videos]);

  const handleIndexClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const video = videoRef.current;
    let hls: Hls | null = null;

    if (video) {
      const src = videos[currentIndex].m3u8Url;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          hls!.currentLevel = -1;

          video.play().catch((err) => console.warn("Auto-play blocked:", err));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((err) => console.warn("Auto-play blocked:", err));
        });
      }

      const updateProgress = () => {
        if (video.duration) {
          const percent = (video.currentTime / video.duration) * 100;
          setProgress(percent);
        } else {
          setProgress(0);
        }
      };

      const handleEnded = () => {
        handleNext();
      };

      video.addEventListener("timeupdate", updateProgress);
      video.addEventListener("ended", handleEnded);

      return () => {
        if (hls) hls.destroy();
        video.removeEventListener("timeupdate", updateProgress);
        video.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentIndex, videos, handleNext]);

  return (
    <div className="relative w-full h-full max-h-[540px] aspect-[8/3] group">
      {isLoading && !isError ? (
        <div className="w-full h-full bg-silver animate-pulse" />
      ) : !isLoading && isError ? (
        <div className="w-full h-full text-center content-center border">
          <ShowError
            headingText="Unable to load videos"
            descriptionText="Please try again or refresh page"
            showHrLine
          />
        </div>
      ) : (
        <div className="w-full h-full">
          <video
            ref={videoRef}
            controls={false}
            muted={isMuted}
            className="object-cover w-full h-full"
            poster={videos[currentIndex]?.posterUrl || ""}
          />

          {["prev", "next"].map((type, index) => (
            <button
              key={index}
              onClick={type === "prev" ? handlePrev : handleNext}
              className={`absolute top-1/2 ${
                type === "prev" ? "left-4" : "right-4"
              } transform -translate-y-1/2 bg-primary-50 hover:bg-primary p-3 rounded-full hidden group-hover:lg:block`}
            >
              {type === "prev" ? (
                <LeftArrowIcon className="fill-primary-inverted w-4 h-4" />
              ) : (
                <RightArrowIcon className="fill-primary-inverted w-4 h-4" />
              )}
            </button>
          ))}
          <div className="absolute bottom-0 p-4 w-full flex items-center justify-between">
            {/* Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-primary-50 hover:bg-primary p-1 rounded-full"
            >
              {isMuted ? (
                <VolumeMaxIcon className="[&>path]:stroke-primary-inverted w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
              ) : (
                <VolumeMuteIcon className="[&>path]:stroke-primary-inverted w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
              )}
            </button>
            {/* Index Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {videos.map((_: never, index: number) => (
                <div
                  key={index}
                  onClick={() => handleIndexClick(index)}
                  className="w-2 h-2 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full border-none opacity-80 hover:opacity-100"
                  style={
                    index === currentIndex
                      ? {
                          background: `conic-gradient(var(--blue-crayola-c) ${progress}%, var(--silver-jet) ${progress}%)`,
                          WebkitMask:
                            "radial-gradient(farthest-side, transparent calc(100% - 4px), var(--silver) calc(100% - 4px))",
                          mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), var(--silver) calc(100% - 4px))",
                        }
                      : {
                          border: "4px solid var(--silver-jet)",
                          background: "transparent",
                        }
                  }
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
