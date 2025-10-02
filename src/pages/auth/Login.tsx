import useVerticalScrollable from "../../hooks/useVerticalScrollable";
import { BottomGradient, TopGradient } from "../../components/Gradients";
import AuthRobot from "./components/AuthRobot";
import LoginForm from "../../components/forms/LoginForm";
import DarkMode from "../../components/DarkMode";

const Login = () => {
  const { showGradient, containerRef } = useVerticalScrollable();

  return (
    <div className="w-full min-h-dvh max-h-dvh h-full p-4 flex gap-4 overflow-hidden relative">
      <AuthRobot />
      <DarkMode className="border absolute top-5 right-5 h-fit p-2 md:p-3 rounded-full bg-secondary-inverted !stroke-secondary z-10" />
      <div
        ref={containerRef}
        className={`flex-1 flex flex-col items-center gap-4 overflow-hidden overflow-y-scroll scroll-smooth ${
          !showGradient.bottom && !showGradient.top
            ? "justify-center"
            : "justify-start"
        }`}
      >
        <div className="w-full">
          {showGradient.top && <TopGradient />}
          <LoginForm />
          {showGradient.bottom && <BottomGradient />}
        </div>
      </div>
    </div>
  );
};

export default Login;
