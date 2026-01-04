import { AxiosError } from "axios";
import { Link, useRouteError } from "react-router-dom";

import { VITE_IS_DEV } from "../../envs";
import Button from "../../components/button/Button";

type TError = {
  imgText: string;
  title: string;
  message: string;
};

const Errors = ({ imgText, title, message }: TError) => {
  const error = useRouteError();

  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <h1
        className={`bg-[url('/images/Oops.webp')] bg-no-repeat bg-center bg-cover text-7xl md:text-8xl lg:text-9xl italic font-extrabold max-w-lg w-full text-center bg-clip-text text-transparent`}
      >
        {imgText}
      </h1>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-silver-duo">
        {title}
      </h1>
      <p className="text-tertiary">{message}</p>
      {error && VITE_IS_DEV.includes("true") && (
        <pre className="bg-primary-50 p-2 rounded-lg text-sm text-white max-w-sm text-wrap">
          Error:{" "}
          {error instanceof Error || error instanceof AxiosError
            ? error.message
            : error.toString()}
        </pre>
      )}
      <div className="flex items-center justify-center gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Link to={index === 0 ? "/contact" : "/"} key={index}>
            <Button
              content={index === 0 ? "Contact Us" : "Home"}
              pattern={index === 0 ? "secondary" : "primary"}
              className="min-w-36 base:min-w-40 !rounded-lg"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const NotFound = () => {
  return (
    <Errors
      imgText="404"
      title="Not Found"
      message="Sorry, the page you are looking for does not exist."
    />
  );
};

export const SomethingWentWrong = () => {
  return (
    <Errors
      imgText="Oops"
      title="Something went wrong."
      message="Seems like something is broken, hopefully it's not your heart!"
    />
  );
};
