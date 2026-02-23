import type { IMediaCarousel } from '@/Types';

export const MediaCarousel = ({
  className = '',
  media,
  selected,
  onClick,
  thumbnailRefs,
  handleRemove,
  gradientClassNames,
}: IMediaCarousel) => {
  if (media?.length === 0) return null;

  return (
    <ScrollableGradientContainer
      direction="horizontal"
      className={`w-full ${className}`}
      gradientClassNames={gradientClassNames}
    >
      {media?.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            if (thumbnailRefs?.current) {
              thumbnailRefs.current[i] = el;
            }
          }}
          onClick={() => onClick(i)}
          className={`group relative h-14 w-14 shrink-0 overflow-hidden rounded border shadow-xs transition-colors duration-300 hover:opacity-100 md:h-16 md:w-16 lg:h-20 lg:w-20 ${
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
