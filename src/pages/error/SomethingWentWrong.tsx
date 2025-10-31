import { useRouteError } from "react-router-dom";
import Errors from "./children/Errors";

const SomethingWentWrong = () => {
  const error = useRouteError();
  return (
    <Errors
      imgText="Oops"
      title="Something went wrong."
      message="Seems like something is broken, hopefully it's not your heart!"
      error={error}
    />
  );
};

export default SomethingWentWrong;
