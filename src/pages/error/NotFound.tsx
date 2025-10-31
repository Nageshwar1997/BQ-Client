import Errors from "./children/Errors";

const NotFound = () => {
  return (
    <Errors
      imgText="404"
      title="Not Found"
      message="Sorry, the page you are looking for does not exist."
    />
  );
};

export default NotFound;
