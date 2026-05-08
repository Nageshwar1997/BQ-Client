import { FOR_YOU, FOR_YOU_VIDEOS_DATA } from '@/constants/navbar.constants';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import VideoPlayer from '../../media/VideoPlayer';
import { CategoryLabel, SubCategory } from './grand-children';

const ForYou = () => {
  const [playingVideoIndex, setPlayingVideoIndex] = useState<null | number>(null);

  return (
    <div className="base:columns-2 columns-1 gap-3 lg:columns-4 lg:gap-5">
      {FOR_YOU.subCategories.map((category, index) => {
        const { thumbnail, video } = FOR_YOU_VIDEOS_DATA[index] ?? FOR_YOU_VIDEOS_DATA[0];
        const subCategory = category.subCategories?.[0];
        return (
          <div
            key={index}
            className="border-b-battleship-davys-gray mb-3 break-inside-auto space-y-4 border-b pb-1 md:pb-2 lg:mb-5"
          >
            <CategoryLabel {...category} className="px-2" />
            <SubCategory subCategory={subCategory} className="border-none hover:bg-transparent" />
            {playingVideoIndex === index ? (
              <VideoPlayer
                className="overflow-hidden rounded-lg!"
                videoProps={{ src: video, poster: thumbnail, muted: true, loop: true }}
              />
            ) : (
              <div className="relative transition-transform duration-300 hover:scale-105">
                <img
                  src={thumbnail}
                  alt="Video Thumbnail"
                  className="rounded-lg object-contain"
                  loading="eager"
                />
                <button
                  className="group absolute inset-0 flex cursor-pointer items-center justify-center rounded-md bg-black/50"
                  onClick={() => setPlayingVideoIndex(index)}
                >
                  <Icon
                    icon="solar:play-linear"
                    className="size-10 text-white/50 group-hover:text-white"
                  />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ForYou;
