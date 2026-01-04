import { Link } from "react-router-dom";
import { socialMediaAccounts } from "../data";
import { getBackendURL } from "../../../utils";

const SocialAuth = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {socialMediaAccounts.map((item, index) => (
        <Link
          to={`${getBackendURL()}/api/auth/${item.name}`}
          key={index}
          className="h-12 w-12 p-2.5 rounded-2xl border border-primary-8 bg-seasalt-black backdrop-blur mb-2.5 shadow-neumorphic-layered"
        >
          <img
            src={item.url}
            alt=""
            className="w-full h-full p-0.5 object-cover"
            title={item.name}
          />
        </Link>
      ))}
    </div>
  );
};

export default SocialAuth;
