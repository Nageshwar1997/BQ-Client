import Loading from "./loading/Loading";

const LoadingPage = ({ text }: { text?: string }) => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-primary-inverted-50 w-full h-full z-[100]">
      <Loading content={text as string} />
    </div>
  );
};

export default LoadingPage;
