import { useGetBlogById } from "../../api/blog/blog.service";
import QuillContent from "../../components/QuillContent";
import usePathParams from "../../hooks/usePathParams";
import { IBlog } from "../../../types";
import { formatDate } from "../../../utils";
import { UserCircleIcon } from "../../../icons";
import ShowApiStatus from "../../components/api-status/ShowApiStatus";

const BlogDetails = () => {
  const { pathParams } = usePathParams();
  const { data, isError, isLoading } = useGetBlogById(pathParams.blogId!);

  // Store previous blog to prevent flicker
  const blog: IBlog = data?.blog;

  if (isLoading) {
    return (
      <ShowApiStatus
        headingText=""
        className="min-h-[90dvh]"
        loadingText="Loading blog..."
        type="loading"
      />
    );
  }

  if (isError || !blog) {
    return (
      <ShowApiStatus
        className="min-h-[90dvh]"
        headingText={
          isError ? "Oops! Unable to load the blog" : "Blog not available"
        }
        descriptionText={
          isError
            ? "There was a problem fetching this blog. Please try again or refresh the page."
            : "The blog you’re looking for could not be found or has been removed."
        }
        type={isError ? "error" : "empty"}
      />
    );
  }

  // Render the blog content
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-primary leading-normal">
          {blog.mainTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-tertiary">
          {blog.subTitle}
        </p>
      </header>
      {/* Author */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16">
          {blog.publisher?.profilePic ? (
            <img
              src={blog.publisher.profilePic}
              alt="Author"
              className="w-full h-full rounded-full object-cover aspect-square"
            />
          ) : (
            <UserCircleIcon className="stroke-secondary w-full h-full" />
          )}
        </div>
        <div>
          <p className="font-semibold text-primary">
            {blog.publisher?.firstName} {blog.publisher?.lastName}
          </p>
          <p className="font-medium text-secondary">{blog.author}</p>
          <p className="text-sm text-silver">
            {formatDate(blog.publishedDate, "llll")}
          </p>
        </div>
      </div>

      {/* Banner */}
      <img
        src={blog.largeThumbnail}
        alt="Blog Banner"
        className="w-full rounded-xl mb-8"
      />

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-tertiary">
        {blog.description}
      </p>

      {/* Blog Content */}
      <QuillContent key={blog._id} content={blog.content} />

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <div
              key={index}
              className="text-secondary border border-primary-50 px-4 py-1 rounded-full text-sm bg-primary-10 font-medium"
            >
              #{tag}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
