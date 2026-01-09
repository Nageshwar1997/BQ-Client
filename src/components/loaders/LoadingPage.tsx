import { ClassName } from "../../types";
import Loading from "./loading/Loading";

const LoadingPage = ({
  text,
  className = "",
}: { text: string } & ClassName) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-primary-inverted-50 w-full h-full z-100 ${className}`}
    >
      <Loading content={text} />
    </div>
  );
};

export default LoadingPage;
