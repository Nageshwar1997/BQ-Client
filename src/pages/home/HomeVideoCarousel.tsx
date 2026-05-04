import { HOME_VIDEOS_DATA } from '@/constants/common.constants';
import { Icon } from '@iconify/react';
import Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';

const HomeVideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const videos = HOME_VIDEOS_DATA;

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

          video.play().catch((err) => console.warn('Auto-play blocked:', err));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((err) => console.warn('Auto-play blocked:', err));
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

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', handleEnded);

      return () => {
        if (hls) hls.destroy();
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentIndex, videos, handleNext]);

  return (
    <div className="group relative aspect-8/3 h-full max-h-135 w-full">
      <div className="h-full w-full">
        <video
          ref={videoRef}
          controls={false}
          muted={isMuted}
          className="h-full w-full object-cover"
          poster={videos[currentIndex]?.posterUrl || ''}
        />

        {['prev', 'next'].map((type, index) => (
          <button
            key={index}
            onClick={type === 'prev' ? handlePrev : handleNext}
            className={`absolute top-1/2 ${
              type === 'prev' ? 'left-4' : 'right-4'
            } bg-primary-50 hover:bg-primary hidden -translate-y-1/2 transform rounded-full p-3 lg:group-hover:block`}
          />
        ))}
        <div className="absolute bottom-0 flex w-full items-center justify-between p-4">
          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-primary/50 hover:bg-primary cursor-pointer rounded-full p-2"
          >
            <Icon
              icon={isMuted ? 'solar:volume-cross-linear' : 'solar:volume-loud-linear'}
              className="text-tertiary-invert size-4 lg:size-5 xl:size-6"
            />
          </button>
          {/* Index Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {videos.map((_, index) => (
              <div
                key={index}
                onClick={() => handleIndexClick(index)}
                className="size-2 rounded-full border-none opacity-80 hover:opacity-100 md:size-4 lg:size-5"
                style={
                  index === currentIndex
                    ? {
                        background: `conic-gradient(rgb(var(--blue-crayola-c-rgb)) ${progress}%, var(--silver-jet) ${progress}%)`,
                        WebkitMask:
                          'radial-gradient(farthest-side, transparent calc(100% - 4px), var(--silver) calc(100% - 4px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), var(--silver) calc(100% - 4px))',
                      }
                    : {
                        border: '4px solid var(--silver-jet)',
                        background: 'transparent',
                      }
                }
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeVideoCarousel;
