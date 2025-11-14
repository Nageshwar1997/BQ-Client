import { useEffect, useMemo } from "react";
import { useGetAllBlogs } from "../../api/blog/blog.service";
import { IBlog } from "../../types";
import { formatDate } from "../../utils";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import ShowApiStatus from "../../components/api-status/ShowApiStatus";
import BlogCardsSkeleton, {
  BlogCardSkeleton,
} from "../../components/skeletons/children/BlogCardSkeleton";

const Blogs = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetAllBlogs();
  const blogs: IBlog[] = useMemo(
    () => data?.pages.flatMap((page) => page.blogs) || [],
    [data]
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-10">
      <header className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Beautinique Blog
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          Discover tips, trends, and tutorials from the world of beauty and
          cosmetics. Stay inspired and informed with our latest articles.
        </p>
      </header>
      {isLoading ? (
        <BlogCardsSkeleton />
      ) : blogs?.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,max-content))] gap-6 justify-center">
          {blogs.map((blog, index) => {
            const isLastItem = index === blogs.length - 4;
            return (
              <Link
                to={`${blog._id}`}
                key={index}
                ref={isLastItem ? ref : null}
                className="max-w-xs rounded-2xl overflow-hidden shadow-xl shadow-primary-8 hover:shadow-xl hover:shadow-primary-10 transition-all bg-secondary-inverted-50 flex flex-col border border-secondary-30"
              >
                <div className="relative w-full h-56 overflow-hidden rounded-t-xl">
                  <img
                    src={blog.smallThumbnail}
                    alt={blog.mainTitle}
                    className="w-full h-full object-cover filter blur-md brightness-75"
                  />
                  {/* For Background Image */}
                  <img
                    src={blog.smallThumbnail}
                    alt={blog.mainTitle}
                    className="absolute inset-0 object-contain w-full h-full z-10 rounded"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1 justify-between shadow-light-dark-soft">
                  <h3 className="font-semibold text-secondary line-clamp-2">
                    {blog.mainTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <div
                        key={tag}
                        className="text-tertiary border border-primary-50 px-2 py-0.5 rounded-full text-[11px]/4 bg-primary-10 font-medium"
                      >
                        {tag}
                      </div>
                    ))}
                    {blog.tags.length > 3 && (
                      <div className="text-tertiary border border-primary-50 px-2 py-0.5 rounded-full text-[11px]/4 bg-primary-10 font-medium">
                        {blog.tags.length - 3 + "+"}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-silver-jet-2 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="flex gap-2 justify-between">
                    <p className="text-xs font-medium text-silver line-clamp-1">
                      {blog.author}
                    </p>
                    <p className="text-xs text-tertiary font-medium line-clamp-1">
                      {formatDate(blog.publishedDate, "lll")}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          {isFetchingNextPage && <BlogCardSkeleton />}
        </div>
      ) : (
        <ShowApiStatus
          headingText={isError ? "We Hit a Snag" : "Blogs Coming Soon!"}
          descriptionText={
            isError
              ? "Our beauty feed failed to load. Please retry in a moment."
              : "Exciting beauty tips and trends are on the way. Stay tuned!"
          }
          type={isError ? "error" : "empty"}
          className="min-h-[50dvh]"
        />
      )}
    </div>
  );
};

export default Blogs;
