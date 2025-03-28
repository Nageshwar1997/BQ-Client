import { useState } from "react";
import { useGetHomeVideos } from "../../../api/media/media.service";
import CloudinaryPlayer from "./CloudinaryPlayer";

const VideoCarousel = () => {
  const { data, isLoading, error } = useGetHomeVideos();
  const videos = data?.videos || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videos[currentIndex];

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  if (isLoading) return <div>Loading videos...</div>;
  if (error) return <div>Failed to load videos.</div>;
  if (!videos.length) return <div>No videos available.</div>;

  return (
    <div className="relative w-full h-full border border-red-500">
      <CloudinaryPlayer
        key={currentVideo.public_id} // 👈 Ensure component remounts on video change
        id={`video-${currentVideo.public_id}`}
        publicId={currentVideo.public_id}
        playerConfig={{
          muted: true,
          autoplay: true,
          loop: false,
          controls: false,
          posterOptions: {
            transformation: { effect: "blur" },
          },
        }}
        onEnded={nextVideo} // 👈 Pass callback for auto-next
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 w-full py-4 px-6 text-white bg-black/40 flex items-center justify-between">
        <button
          onClick={prevVideo}
          className="text-white bg-gray-800 px-3 py-1 rounded"
        >
          Prev
        </button>
        <div className="flex items-center gap-2">
          {videos?.map((_: object, index: number) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextVideo}
          className="text-white bg-gray-800 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;
