import { CloseIcon, PlayIcon } from '../../../icons';
import type { IMediaCarousel } from '../../../types';
import VideoPlayer from '../media/VideoPlayer';
import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

const MediaCarousel = ({
  className = '',
  data,
  selected,
  onClick,
  thumbnailRefs,
  handleRemove,
  gradientClassName = '',
}: IMediaCarousel) => {
  if (data?.length === 0) return null;

  return (
    <ScrollableGradientContainer
      direction="horizontal"
      className={`w-full ${className}`}
      gradientClassName={gradientClassName}
    >
      {data?.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            if (thumbnailRefs?.current) {
              thumbnailRefs.current[i] = el;
            }
          }}
          onClick={() => onClick(i)}
          className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded border shadow-xs transition-colors duration-300 hover:opacity-100 ${
            i === selected ? 'border-tertiary opacity-100' : 'border-primary/30 opacity-90'
          } ${item.type === 'video' ? 'relative' : ''}`}
        >
          {item.type === 'video' ? (
            <>
              {i !== selected && (
                <div
                  key={i}
                  className="group pointer-events-none absolute inset-0 flex aspect-square h-full w-full items-center justify-center bg-black/50"
                >
                  <PlayIcon className="fill-white opacity-90 group-hover:opacity-100" />
                </div>
              )}
              <VideoPlayer
                key={item.url}
                videoProps={{ src: item.url, autoPlay: false }}
                className="aspect-square h-full w-full cursor-pointer object-cover"
              />
            </>
          ) : (
            <img
              src={item.url}
              alt={`image-${i}`}
              className="aspect-square h-full w-full cursor-pointer object-cover"
            />
          )}

          {handleRemove && (
            <button
              type="button"
              className="bg-tertiary absolute top-0.5 right-0.5 z-1 flex items-center justify-center rounded-full p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(i);
              }}
            >
              <CloseIcon className="stroke-primary-invert h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </ScrollableGradientContainer>
  );
};

export default MediaCarousel;
