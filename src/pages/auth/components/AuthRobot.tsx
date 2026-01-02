import Branding from "../../../components/Branding";

const AuthRobot = () => {
  return (
    <div
      className="w-1/2 hidden lg:flex flex-col items-center justify-center rounded-2xl"
      style={{
        background:
          "linear-gradient(270deg, var(--primary-inverted) 1%, var(--blue-crayola-c) 40%, #001B99 100%)",
      }}
    >
      <div className="w-full flex flex-col items-center gap-2 text-white">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          Welcome to Beautinique
        </h1>
        <h2 className="text-base md:text-lg lg:text-xl">
          Become a part of our community
        </h2>
        <Branding type="light" />
      </div>
    </div>
  );
};

export default AuthRobot;
