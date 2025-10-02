import { ButtonProps } from "../../types";

const Button = ({
  pattern,
  content,
  className = "",
  leftIcon,
  rightIcon,
  buttonProps,
}: ButtonProps) => {
  const buttonCss = () => {
    if (pattern === "primary") {
      return "text-white bg-sky-blue-burst shadow-primary-btn hover:shadow-primary-btn-hover";
    } else if (pattern === "secondary") {
      return "text-secondary-inverted bg-secondary shadow-secondary-btn hover:shadow-secondary-btn-hover";
    } else if (pattern === "tertiary") {
      return "text-secondary-inverted bg-tertiary shadow-tertiary-btn hover:shadow-tertiary-btn-hover";
    } else if (pattern === "outline") {
      return "text-primary border border-primary shadow-outline-btn hover:shadow-outline-btn-hover";
    } else {
      return "shadow-inner light:shadow-primary-10 dark:shadow-primary-30 hover:shadow-primary-30 bg-transparent border-none";
    }
  };

  const getButtonCSS = buttonCss();
  return (
    <button
      {...buttonProps}
      className={`w-full text-sm xl:text-base font-semibold font-metropolis leading-4 rounded-xl flex justify-center items-center gap-1 py-3 lg:py-4 px-4 lg:px-5 outline-none focus-within:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 transition-all duration-300 group ${getButtonCSS} ${className} ${
        buttonProps?.className ?? ""
      }`}
      type={buttonProps?.type || "button"}
      onClick={
        !buttonProps?.disabled && buttonProps?.onClick
          ? buttonProps.onClick
          : undefined
      }
    >
      {leftIcon && <span>{leftIcon}</span>}
      {content && <span>{content}</span>}
      {rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;
