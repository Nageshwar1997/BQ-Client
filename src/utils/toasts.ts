import toast from "react-hot-toast";

export const toastCatchErrorMessage = (error: unknown, message?: string) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(message || "Something went wrong!");
  }
};
export const toastErrorMessage = (message: string | unknown) => {
  toast.error(typeof message === "string" ? message : "Something went wrong!");
};

export const toastSuccessMessage = (message: unknown) => {
  toast.success(typeof message === "string" ? message : "Success");
};
