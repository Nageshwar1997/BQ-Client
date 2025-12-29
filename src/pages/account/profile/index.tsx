import { useUserStore } from "../../../store/user.store";
import Input from "../../../components/input/Input";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateUserSchema } from "../../auth/helpers/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditIcon,
  ImageUpIcon,
  InfoIcon,
  RefreshIcon,
  UserCircleIcon,
} from "../../../icons";
import Button from "../../../components/button/Button";
import FileInput from "../../../components/input/FileInput";
import { useRef, useState } from "react";

const Profile = () => {
  const [editableInputs, setEditableInputs] = useState<
    Record<keyof z.infer<typeof updateUserSchema>, boolean>
  >({
    profilePic: false,
    email: false,
    phoneNumber: false,
    firstName: false,
    lastName: false,
  });

  // 👇 This stores which input should focus
  const focusRef = useRef<keyof typeof editableInputs | null>(null);

  const { user } = useUserStore();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      profilePic: user?.profilePic,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });

  const profilePicList = watch("profilePic");

  const profilePic =
    profilePicList instanceof FileList && profilePicList?.[0]
      ? profilePicList[0]
      : null;

  const onSubmit = (data: z.infer<typeof updateUserSchema>) => {
    console.log("DATA", data);
  };

  return (
    <div className="p-6 space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent capitalize">
          Welcome back {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          This is your profile page. You can view and edit your personal
          information, and more from here.
        </p>
      </header>

      <hr className="w-full h-px block border-none bg-gradient-line" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* PROFILE PIC + CHANGE PASSWORD */}
        <div className="flex justify-between gap-6 mb-2">
          <label
            htmlFor="profilePic"
            className="flex flex-col max-w-40 w-full group cursor-pointer"
          >
            <div className="w-full h-full relative border border-tertiary-50 overflow-hidden rounded-lg">
              {profilePic || user?.profilePic ? (
                <img
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : user?.profilePic
                  }
                  alt="Profile Pic"
                  className="w-full max-h-40 aspect-square object-cover"
                />
              ) : (
                <UserCircleIcon className="stroke-tertiary w-full h-full p-5" />
              )}

              <div className="absolute bottom-0 right-0 p-1 bg-tertiary rounded-tl-lg">
                <ImageUpIcon className="stroke-tertiary-inverted group-hover:stroke-primary-inverted" />
              </div>
            </div>

            {errors.profilePic?.message && (
              <p className="mt-2 w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500">
                <InfoIcon className="min-w-3 min-h-3 w-3 h-3 md:min-w-4 md:min-h-4 md:w-4 md:h-4 fill-red-500" />
                <span className="leading-none line-clamp-2 text-wrap">
                  {errors.profilePic?.message}
                </span>
              </p>
            )}

            <FileInput
              register={register("profilePic")}
              fileInputProps={{
                name: "profilePic",
                multiple: false,
              }}
              containerClassName="hidden"
            />
          </label>

          <Button
            pattern="outline"
            content={
              user?.providers?.includes("MANUAL")
                ? "Change Password"
                : "Set Password"
            }
            className="group cursor-pointer flex flex-col items-center justify-center gap-3 max-w-40 max-h-40 border border-tertiary-50 overflow-hidden rounded-lg"
            leftIcon={
              <RefreshIcon className="w-7 h-7 sm:w-10 sm:h-10 stroke-primary" />
            }
          />
        </div>

        {/* FIRST + LAST NAME */}
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-6">
          <Input
            label="First Name"
            register={register("firstName")}
            needRef={focusRef.current === "firstName"}
            error={errors.firstName?.message}
            inputProps={{
              name: "firstName",
              placeholder: "Enter first name",
              disabled: !editableInputs.firstName,
            }}
            icons={{
              right: {
                icon: (
                  <EditIcon className="w-5 h-5 stroke-primary opacity-50 group-hover:opacity-100" />
                ),
                onClick: () => {
                  focusRef.current = "firstName";
                  setEditableInputs((prev) => ({ ...prev, firstName: true }));
                },
              },
            }}
          />

          <Input
            label="Last Name"
            register={register("lastName")}
            needRef={focusRef.current === "lastName"}
            error={errors.lastName?.message}
            inputProps={{
              name: "lastName",
              placeholder: "Enter last name",
              disabled: !editableInputs.lastName,
            }}
            icons={{
              right: {
                icon: (
                  <EditIcon className="w-5 h-5 stroke-primary opacity-50 group-hover:opacity-100" />
                ),
                onClick: () => {
                  focusRef.current = "lastName";
                  setEditableInputs((prev) => ({ ...prev, lastName: true }));
                },
              },
            }}
          />
        </div>

        {/* EMAIL + PHONE */}
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-6">
          <Input
            label="Email"
            register={register("email")}
            needRef={focusRef.current === "email"}
            error={errors.email?.message}
            inputProps={{
              name: "email",
              placeholder: "Enter email address",
              disabled: !editableInputs.email,
            }}
            icons={{
              ...(!user?.providers?.filter((p) => p !== "MANUAL").length && {
                right: {
                  icon: (
                    <EditIcon className="w-5 h-5 stroke-primary opacity-50 group-hover:opacity-100" />
                  ),
                  onClick: () => {
                    focusRef.current = "email";
                    setEditableInputs((prev) => ({ ...prev, email: true }));
                  },
                },
              }),
            }}
          />

          <Input
            label="Phone Number"
            register={register("phoneNumber")}
            needRef={focusRef.current === "phoneNumber"}
            error={errors.phoneNumber?.message}
            inputProps={{
              name: "phoneNumber",
              placeholder: "Enter phone number",
              type: "number",
              disabled: !editableInputs.phoneNumber,
            }}
            icons={{
              right: {
                icon: (
                  <EditIcon className="w-5 h-5 stroke-primary opacity-50 group-hover:opacity-100" />
                ),
                onClick: () => {
                  focusRef.current = "phoneNumber";
                  setEditableInputs((prev) => ({ ...prev, phoneNumber: true }));
                },
              },
              left: { text: "+91" },
            }}
          />
        </div>

        <hr className="w-full h-px block border-none bg-gradient-line my-4" />

        <div className="flex gap-4">
          <Button
            pattern="secondary"
            content="Reset"
            className="rounded-lg"
            buttonProps={{ type: "button", onClick: () => reset() }}
          />
          <Button
            pattern="primary"
            content="Update"
            className="rounded-lg"
            buttonProps={{ type: "submit" }}
          />
        </div>
      </form>
    </div>
  );
};

export default Profile;
