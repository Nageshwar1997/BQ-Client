import { useUserStore } from "../../../store/user.store";
import Input from "../../../components/input/Input";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateUserSchema } from "../../auth/helpers/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, RefreshIcon } from "../../../icons";
import Button from "../../../components/button/Button";
import ProfilePicInput from "../../auth/components/ProfilePicInput";
import { useRef, useState } from "react";
import { UserTypes } from "../../../types";
import { deepEqual, getFileFromFileList } from "../../../utils";
import { useUpdateUser } from "../../../api/user/user.service";
import { toastErrorMessage } from "../../../utils/toasts";
import { UPDATE_PROFILE_FIELDS } from "../../../constants";
import PasswordConfirmationModal from "../../../components/modal/children/PasswordConfirmationModal";
import useQueryParams from "../../../hooks/useQueryParams";

const Profile = () => {
  const { setParams } = useQueryParams();
  const { mutateAsync, isPending } = useUpdateUser();

  const [editableInputs, setEditableInputs] = useState<
    Record<keyof z.infer<typeof updateUserSchema>, boolean>
  >({
    profilePic: false,
    email: false,
    phoneNumber: false,
    firstName: false,
    lastName: false,
  });

  // This stores which input should focus
  const focusRef = useRef<keyof typeof editableInputs | null>(null);
  const { user, setUser } = useUserStore();

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty },
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

  const profilePicFile = getFileFromFileList(watch("profilePic"));

  const profilePicURL =
    profilePicFile instanceof File ? URL.createObjectURL(profilePicFile) : null;

  const handleReset = () => {
    reset();
    if (profilePicURL) URL.revokeObjectURL(profilePicURL);
  };

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    type TempUser = Partial<
      Pick<UserTypes, "firstName" | "lastName" | "email" | "phoneNumber">
    >;

    const apiData: TempUser = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    };

    const updatedData: TempUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    const changedFields: TempUser = {};
    Object.keys(updatedData).forEach((key) => {
      const typedKey = key as keyof TempUser;
      if (!deepEqual(updatedData[typedKey], apiData[typedKey])) {
        (changedFields[typedKey] as unknown) = updatedData[typedKey];
      }
    });

    if (!Object.keys(changedFields).length) {
      toastErrorMessage("No changes made to update profile!");
      return;
    }

    const formData = new FormData();
    Object.entries(changedFields).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (profilePicFile) formData.append("profilePic", profilePicFile);

    await mutateAsync(formData, { onSuccess: (data) => setUser(data.user) });
  };

  const isSocialAuthOnly = user?.providers?.filter(
    (p) => p !== "MANUAL"
  )?.length;

  const isManualExist = user?.providers?.includes("MANUAL");

  return (
    <>
      <PasswordConfirmationModal />
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
            <ProfilePicInput
              src={profilePicURL || user?.profilePic}
              error={errors.profilePic?.message}
              register={register("profilePic")}
              fileInputProps={{ name: "profilePic" }}
            />
            <Button
              pattern="outline"
              content="Update Password"
              className="group cursor-pointer flex flex-col items-center justify-center gap-3 max-w-40 max-h-40 border border-tertiary-50 overflow-hidden rounded-lg"
              leftIcon={
                <RefreshIcon className="w-7 h-7 sm:w-10 sm:h-10 stroke-primary" />
              }
              buttonProps={{
                type: "button",
                onClick: () =>
                  setParams({
                    confirm:
                      isSocialAuthOnly && !isManualExist
                        ? "update-password"
                        : "change-password",
                  }),
              }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-6">
            {UPDATE_PROFILE_FIELDS.map((field) => {
              const { label, placeholder, autoComplete, type } = field;
              const name = field.name as keyof z.infer<typeof updateUserSchema>;
              const isEditable =
                name === "email" ? !isSocialAuthOnly && isManualExist : true;
              return (
                <Input
                  key={name}
                  label={label}
                  register={register(name)}
                  needRef={focusRef.current === name}
                  error={errors[name]?.message}
                  inputProps={{
                    type,
                    name,
                    placeholder,
                    disabled: !editableInputs[name],
                    autoComplete,
                  }}
                  icons={{
                    ...(isEditable && {
                      right: {
                        icon: (
                          <EditIcon className="w-5 h-5 stroke-primary opacity-50 group-hover:opacity-100" />
                        ),
                        onClick: () => {
                          focusRef.current = name;
                          setEditableInputs((prev) => ({
                            ...prev,
                            [name]: true,
                          }));
                        },
                      },
                    }),
                    ...(name === "phoneNumber" && { left: { text: "+91" } }),
                  }}
                />
              );
            })}
          </div>

          <hr className="w-full h-px block border-none bg-gradient-line my-4" />

          <div className="flex gap-4 [&>button]:rounded-lg">
            <Button
              pattern="secondary"
              content="Reset"
              buttonProps={{ type: "button", onClick: handleReset }}
            />
            <Button
              pattern="primary"
              content="Update"
              buttonProps={{ type: "submit", disabled: isPending || !isDirty }}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
