import Loading from "./loading/Loading";

const LoadingPage = ({ text }: { text: string }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary-inverted-50 w-full h-full z-[100]">
      <Loading content={text} />
    </div>
  );
};

export default LoadingPage;
