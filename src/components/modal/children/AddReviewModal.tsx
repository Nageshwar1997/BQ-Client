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
import { zodStringRequired } from "../../../utils/zod";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MB,
} from "../../../constants";
import FileInput from "../../input/FileInput";
import { TFile } from "../../../types";
import { DevTool } from "@hookform/devtools";
const reviewInitialValues = {
  title: "",
  comment: "",
  media: [],
};

const reviewSchema = z.object({
  title: zodStringRequired({
    field: "title",
    showingFieldName: "Title",
    min: 2,
    blockMultipleSpaces: true,
  }),
  comment: zodStringRequired({
    field: "comment",
    showingFieldName: "Comment",
    min: 10,
    blockMultipleSpaces: true,
  }),
  media: z.array(z.any()).superRefine((files, ctx) => {
    files.forEach((file, index) => {
      let isVideo = false;

      if (typeof File !== "undefined" && file instanceof File) {
        // detect type
        isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

        // type check
        const allowedTypes = isVideo
          ? ALLOWED_VIDEO_TYPES
          : ALLOWED_IMAGE_TYPES;
        if (!allowedTypes.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${isVideo ? "Video" : "Image"} ${
              index + 1
            } invalid format. Allowed formats: ${allowedTypes
              .map((t) => t.split("/")[1])
              .join(", ")}`,
            path: [index],
          });
        }

        // size check
        const maxSize = isVideo ? MAX_VIDEO_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
        if (file.size > maxSize) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${isVideo ? "Video" : "Image"} ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is ${
              maxSize / MB
            } MB.`,
            path: [index],
          });
        }
      } else if (typeof file === "string") {
        try {
          const url = new URL(file);
          if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error();
          }
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${isVideo ? "Video" : "Image"} ${
              index + 1
            } is not a valid URL`,
            path: [index],
          });
        }
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item ${index + 1} must be a File or a valid media URL`,
          path: [index],
        });
      }
    });
  }),
});

const AddReviewModal = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [media, setMedia] = useState<{
    files: File[];
    previews: { url: string; type: TFile }[];
  }>({ files: [], previews: [] });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: reviewInitialValues,
  });

  const handleAddReview = (data: z.infer<typeof reviewSchema>) => {
    console.log("Submitted", data);
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <form
        onSubmit={handleSubmit(handleAddReview)}
        className="flex flex-col gap-4"
      >
        <TextDisplay content={[{ text: "Add Review" }]} className="!text-2xl" />
        <Input
          inputProps={{ placeholder: "Enter your name", name: "name" }}
          register={register("title")}
          error={errors.title?.message}
          label="Title"
        />
        <Textarea
          placeholder="Enter your review"
          register={register("comment")}
          errorText={errors.comment?.message}
          name="comment"
          label="Comment"
        />
        <Controller
          control={control}
          name="media"
          defaultValue={[]}
          render={({ field }) => (
            <FileInput
              name="media"
              label="Images / Videos"
              placeholder="Select media files"
              acceptableFiles={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]}
              previews={media.previews}
              errors={
                Array.isArray(errors.media)
                  ? errors.media.map((err) => err.message)
                  : errors.media?.message
                  ? [errors.media.message]
                  : []
              }
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const previews = files.map((file) => ({
                  url: URL.createObjectURL(file),
                  type: (file.type.startsWith("video")
                    ? "video"
                    : "image") as TFile,
                }));

                const newFiles = [...media.files, ...files];
                const newPreviews = [...media.previews, ...previews];

                setMedia({ files: newFiles, previews: newPreviews });
                field.onChange(newFiles);
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
              rightIcon={
                <UploadCloudIcon className="stroke-primary opacity-50 group-hover:opacity-100" />
              }
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
