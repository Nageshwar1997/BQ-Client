import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "..";
import Input from "../../input/Input";
import Textarea from "../../input/Textarea";
import TextDisplay from "../../TextDisplay";
import { Controller, useForm } from "react-hook-form";
import { UploadCloudIcon } from "../../../icons";
import Button from "../../button/Button";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  reviewInitialValues,
} from "../../../constants";
import FileInput from "../../input/FileInput";
import { TMediaOption } from "../../../types";
import { DevTool } from "@hookform/devtools";
import { addReviewSchema } from "../../../schemas/review";

type TMediaState = { files: File[]; previews: TMediaOption[] };
type TAddReviewModal = { isOpen: boolean; onClose: () => void };

const AddReviewModal = ({ onClose, isOpen }: TAddReviewModal) => {
  const [media, setMedia] = useState<TMediaState>({ files: [], previews: [] });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof addReviewSchema>>({
    resolver: zodResolver(addReviewSchema),
    defaultValues: reviewInitialValues,
  });
  console.log("errors", errors);
  const handleAddReview = (data: z.infer<typeof addReviewSchema>) => {
    const images = data.media.filter((file) =>
      ALLOWED_IMAGE_TYPES.includes(file.type)
    );
    const videos = data.media.filter((file) =>
      ALLOWED_VIDEO_TYPES.includes(file.type)
    );

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("comment", data.comment);
    formData.append("images", JSON.stringify(images));
    formData.append("videos", JSON.stringify(videos));
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <form
        onSubmit={handleSubmit(handleAddReview)}
        className="flex flex-col gap-4"
      >
        <TextDisplay content={[{ text: "Add Review" }]} className="!text-2xl" />
        <Input
          inputProps={{ placeholder: "Enter your name", name: "title" }}
          register={register("title")}
          error={errors.title?.message}
          label="Title"
        />
        <Textarea
          textAreaProps={{
            name: "comment",
            rows: 4,
            placeholder: "Write your review here...",
          }}
          register={register("comment")}
          error={errors.comment?.message}
          label="Comment"
        />
        <Controller
          control={control}
          name="media"
          defaultValue={[]}
          render={({ field }) => (
            <FileInput
              label="Images / Videos"
              previews={media.previews}
              errors={
                Array.isArray(errors.media)
                  ? errors.media.map((err) => err.message)
                  : errors.media?.message
                  ? [errors.media.message]
                  : []
              }
              fileInputProps={{
                name: "media",
                placeholder: "Add images or videos",
                accept: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(
                  ", "
                ),
                multiple: true,
                onChange: (e) => {
                  const files = Array.from(e.target.files || []);
                  const previews: TMediaOption[] = files.map((file) => ({
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith("video") ? "video" : "image",
                  }));

                  const newFiles = [...media.files, ...files];
                  const newPreviews = [...media.previews, ...previews];

                  setMedia({ files: newFiles, previews: newPreviews });
                  field.onChange(newFiles);
                },
              }}
              handleRemoveImage={(idx) => {
                const updatedFiles = media.files.filter((_, i) => i !== idx);
                const updatedPreviews = media.previews.filter(
                  (_, i) => i !== idx
                );

                setMedia({
                  files: updatedFiles,
                  previews: updatedPreviews,
                });
                field.onChange(updatedFiles);
              }}
              icons={{
                right: {
                  icon: (
                    <UploadCloudIcon className="stroke-primary opacity-50 group-hover:opacity-100" />
                  ),
                },
              }}
            />
          )}
        />
        <Button content="Submit" pattern="primary" type="submit" />
        <DevTool control={control} />
      </form>
    </Modal>
  );
};

export default AddReviewModal;
