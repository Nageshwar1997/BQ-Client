import { FC, useCallback, useEffect, useRef, useState } from "react";
import type { VideoPlayer as CloudinaryVideoPlayer } from "cloudinary-video-player";
import { videoPlayer } from "cloudinary-video-player";
import { useGetHomeVideos } from "../../../api/media/media.service";
import {
  LeftArrowIcon,
  RightArrowIcon,
  VolumeMaxIcon,
  VolumeMuteIcon,
} from "../../../icons";
import ShowError from "../../../components/errors/ShowError";

const videoIds = [
  "Beautinique/Home_Videos/1742127444038_1_Makeup_Reimagine",
  "Beautinique/Home_Videos/1742130132099_3_Glide_Peptide_SPF50_PA++_Lip_Treatment_Must-Have_for_Daily_Protection",
  "Beautinique/Home_Videos/1742719884229_SUGAR_Ace_of_Face_Dewy_Foundation_New_Launch_SUGAR_Cosmetics",
];

const CloudinaryVideoCarousel: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const { data, isLoading, isError } = useGetHomeVideos();
  const videos = data?.videos;

  const cloudinaryRef = useRef<
    null | ((...args: unknown[]) => CloudinaryVideoPlayer)
  >(null);
  const playerInstanceRef = useRef<CloudinaryVideoPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    if (!cloudinaryRef.current) {
      cloudinaryRef.current = videoPlayer as (
        ...args: unknown[]
      ) => CloudinaryVideoPlayer;
    }

    if (playerInstanceRef.current) {
      playerInstanceRef.current.dispose();
      playerInstanceRef.current = null;
    }

    const player = cloudinaryRef.current(
      "cloudinary-video",
      {
        cloud_name: "dag2xvurz",
        secure: true,
        controls: true,
        muted: isMuted,
      },
      () => {
        player.source(videoIds[currentIndex], {
          autoplay: true,
          muted: isMuted,
          controls: false,
          loop: false,
        });
        playerInstanceRef.current = player;
      }
    );

    const videoElement = document.getElementById(
      "cloudinary-video"
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.addEventListener("ended", handleNext);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("ended", handleNext);
      }
      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
        playerInstanceRef.current = null;
      }
    };
  }, [currentIndex, handleNext, isMuted]);

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
            id="cloudinary-video"
            className="w-full h-full object-cover border border-red-500"
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

export default CloudinaryVideoCarousel;
