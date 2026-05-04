import Button from '@/components/ui/Button';
import { FOR_YOU, SOCIAL_COMMUNITY } from '@/constants/navbar.constants';
import usePathParams from '@/hooks/usePathParams';
import { Icon } from '@iconify/react';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../../media/VideoPlayer';
import { CategoryLabel } from './grand-children';

const ForYou = () => {
  const { navigate } = usePathParams();
  const [playingVideoIndex, setPlayingVideoIndex] = useState<null | number>(null);
  return (
    <div className="h-full w-full space-y-4 p-4 lg:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-4">
        {FOR_YOU.subCategories.map((category, index) => {
          const path = category.subCategories?.[0]?.path || category.path;
          return (
            <Fragment key={index}>
              {/* Desktop View */}
              <div className="hidden flex-col gap-6 lg:flex">
                {/* Top Heading Label */}
                <CategoryLabel label={category?.heading as string} path={category.path} />
                <div
                  onClick={() => (path ? navigate(path) : undefined)}
                  className="hover:bg-platinum-black group relative flex cursor-pointer flex-col gap-2 rounded-xl p-3"
                  onMouseEnter={() => setPlayingVideoIndex(index)}
                >
                  <CategoryLabel
                    label={category.label}
                    className="text-silver-jet group-hover:text-primary px-0! capitalize"
                  />
                  <p className="text-battleship-davys-gray-invert group-hover:text-silver-jet line-clamp-2 text-xs leading-5 tracking-tight">
                    {category.description}
                  </p>
                  <div className="group-hover:shadow-primary-invert relative h-37.5 max-w-62.5 overflow-hidden rounded-lg group-hover:shadow-xs">
                    {playingVideoIndex === index ? (
                      <VideoPlayer
                        videoProps={{
                          src: category.videoUrl,
                          poster: category.thumbnail,
                          muted: true,
                          loop: true,
                        }}
                      />
                    ) : (
                      <img
                        src={category.thumbnail}
                        alt="Video Thumbnail"
                        className="h-full w-full rounded-lg object-cover"
                        loading="eager"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile View */}
              <div className="border-b-primary/50 flex w-full justify-between gap-2 border-b p-4 lg:hidden">
                <div className="flex w-1/2 flex-col items-start justify-start gap-1 sm:w-2/3 sm:gap-3">
                  <CategoryLabel
                    label={category.heading as string}
                    path={category.path}
                    className="border-battleship-davys-gray/30 mt-0! border-b px-0! py-1 text-left"
                  />
                  <div className="flex cursor-pointer items-center justify-between gap-4 pt-1">
                    <div className="flex flex-col items-start gap-1">
                      <CategoryLabel
                        label={category.label}
                        path={path}
                        className="text-silver-jet mt-0! px-0! text-left capitalize"
                      />
                      <p className="text-battleship-davys-gray-invert pt-1 text-left text-[10.5px] leading-4.5 sm:text-xs md:text-sm">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-primary/10 bg-platinum-black group-hover:bg-smoke-eerie relative flex h-30 w-1/2 max-w-50 items-center justify-center overflow-hidden rounded-lg border sm:w-1/3">
                  {playingVideoIndex === index ? (
                    <VideoPlayer
                      videoProps={{
                        src: category.videoUrl,
                        poster: category.thumbnail,
                        muted: true,
                        loop: true,
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={category.thumbnail}
                        alt="Video Thumbnail"
                        className="h-full w-full rounded-md object-cover"
                        loading="eager"
                      />
                      {/* Play Button */}
                      <button
                        className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50"
                        onClick={() => setPlayingVideoIndex(index)}
                      >
                        <Icon icon="solar:play-linear" className="size-10 text-white/50" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      {/* Only show the section below on desktop */}
      <div className="hidden lg:block">
        <div className="bg-primary/50 my-6 h-px rounded-full" />
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-6 text-sm">
            {SOCIAL_COMMUNITY.map((data) => {
              return (
                <Link key={data.label} to={data.path} className="group flex items-center gap-2">
                  <Icon
                    icon={data.icon}
                    className="text-secondary size-5 opacity-80 group-hover:opacity-100"
                  />
                  <span className="text-secondary text-sm leading-5 opacity-80 group-hover:opacity-100">
                    {data.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-tertiary text-sm">Ready to get started?</span>
            <Link to="/auth/register">
              <Button content="Register" pattern="outline" className="lg:py-2!" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
