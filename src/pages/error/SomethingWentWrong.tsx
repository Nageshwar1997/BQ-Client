import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { AxiosError } from "axios";

import { envs } from "../../envs/index.env";
import Button from "../../components/button/Button";

const SomethingWentWrong: React.FC = () => {
  const error = useRouteError();
  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <h1
        className={`bg-[url('/images/Oops.webp')] bg-no-repeat bg-center bg-cover text-7xl md:text-8xl lg:text-9xl italic font-extrabold max-w-lg w-full text-center bg-clip-text text-transparent`}
      >
        Oops
      </h1>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
        Something went wrong.
      </h1>
      <p className="text-tertiary">
        Seems like something is broken, hopefully it's not your heart !
      </p>
      {envs.NODE_ENV?.includes("development") && error && (
        <pre className="bg-primary-50 p-2 rounded-lg text-sm text-white max-w-sm text-wrap">
          Error:{" "}
          {error instanceof Error || error instanceof AxiosError
            ? error.message
            : error.toString()}
        </pre>
      )}
      <div className="flex items-center justify-center gap-4">
        <Link to="contact">
          <Button
            content="Contact Us"
            pattern="secondary"
            className="min-w-36 base:min-w-40 !rounded-lg"
          />
        </Link>
        <Link to="/">
          <Button
            content="Home"
            pattern="primary"
            className="min-w-36 base:min-w-40 !rounded-lg"
          />
        </Link>
      </div>
    </div>
  );
};

export default SomethingWentWrong;
