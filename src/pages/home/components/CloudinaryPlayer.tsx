import { FC, useEffect, useRef } from "react";
import type { VideoPlayer as CloudinaryVideoPlayer } from "cloudinary-video-player";
import { videoPlayer } from "cloudinary-video-player";

interface VideoPlayerProps {
  id?: string;
  publicId: string;
  playerConfig?: object;
  sourceConfig?: object;
  onEnded?: () => void; // 👈 Callback for video end
}

const CloudinaryPlayer: FC<VideoPlayerProps> = ({
  id = "cloudinary-video",
  publicId,
  playerConfig = {},
  sourceConfig = {},
  onEnded,
  ...props
}) => {
  const cloudinaryRef = useRef<
    null | ((...args: unknown[]) => CloudinaryVideoPlayer)
  >(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const playerInstanceRef = useRef<CloudinaryVideoPlayer | null>(null);

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
      id,
      {
        cloud_name: "dag2xvurz",
        secure: true,
        controls: true,
        muted: true,
        ...playerConfig,
      },
      () => {
        player.source(publicId, sourceConfig);
        playerInstanceRef.current = player;
      }
    );

    // ✅ Native HTML video event for ended
    const videoElement = document.getElementById(id) as HTMLVideoElement;
    if (videoElement && onEnded) {
      videoElement.addEventListener("ended", onEnded);
    }

    return () => {
      if (videoElement && onEnded) {
        videoElement.removeEventListener("ended", onEnded);
      }

      if (playerInstanceRef.current) {
        playerInstanceRef.current.dispose();
        playerInstanceRef.current = null;
      }
    };
  }, [id, publicId, playerConfig, sourceConfig, onEnded]);

  return (
    <div className="relative w-full h-full border border-[red]">
      <video
        ref={playerRef}
        id={id}
        {...props}
        className="border border-[red]"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default CloudinaryPlayer;
