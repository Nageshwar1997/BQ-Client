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
import MediaInput from "../../input/MediaInput";
import VideoInput from "../../input/VideoInput";

const reviewInitialValues = {
  title: "",
  comment: "",
  images: [],
  videos: [],
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
  images: z.array(z.any()).superRefine((files, ctx) => {
    files.forEach((file, index) => {
      if (typeof File !== "undefined" && file instanceof File) {
        // File size check
        if (file.size > MAX_IMAGE_FILE_SIZE) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            path: [index],
          });
        }

        // File type check
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } invalid format. Allowed formats: ${ALLOWED_IMAGE_TYPES.map((t) =>
              t.replace("image/", "")
            ).join(", ")}`,
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
            message: `Image ${index + 1} is not a valid URL`,
            path: [index],
          });
        }
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item ${index + 1} must be a File or a valid image URL`,
          path: [index],
        });
      }
    });
  }),
  videos: z.array(z.any()).superRefine((files, ctx) => {
    files.forEach((file, index) => {
      if (typeof File !== "undefined" && file instanceof File) {
        // File size check
        if (file.size > MAX_VIDEO_FILE_SIZE) {
          const sizeInMB = (file.size / MB).toFixed(1);
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Image ${
              index + 1
            } is too large (${sizeInMB} MB). Max allowed is 2 MB.`,
            path: [index],
          });
        }

        // File type check
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Video ${
              index + 1
            } invalid format. Allowed formats: ${ALLOWED_VIDEO_TYPES.map((t) =>
              t.replace("video/", "")
            ).join(", ")}`,
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
            message: `Image ${index + 1} is not a valid URL`,
            path: [index],
          });
        }
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Item ${index + 1} must be a File or a valid image URL`,
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
    images: {
      files: File[];
      previews: string[];
    };
    videos: {
      files: File[];
      previews: string[];
    };
  }>({
    images: {
      files: [],
      previews: [],
    },
    videos: {
      files: [],
      previews: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: reviewInitialValues,
  });

  const handleAddReview = () => {
    console.log("Submitted");
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <form
        onSubmit={handleSubmit(handleAddReview)}
        className="flex flex-col gap-4"
      >
        <TextDisplay content={[{ text: "Add Review" }]} className="!text-2xl" />
        <Input
          placeholder="Enter your name"
          register={register("title")}
          errorText={errors.title?.message}
          name="title"
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
          name="images"
          defaultValue={[]}
          render={({ field }) => (
            <MediaInput
              name={"images"}
              label="Images"
              placeholder="Select Images"
              acceptableFiles={ALLOWED_IMAGE_TYPES}
              previews={[
                ...media.images.previews.map((p) => ({
                  url: p,
                  type: "image" as const,
                })),
              ]}
              errors={
                Array.isArray(errors.images)
                  ? errors.images.map((err) => err.message)
                  : errors.images?.message
                  ? [errors.images.message]
                  : []
              }
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const previews = files.map((file) => URL.createObjectURL(file));

                const newFiles = [...media.images.files, ...files];
                const newPreviews = [...media.images.previews, ...previews];

                setMedia((prev) => ({
                  ...prev,
                  images: { previews: newPreviews, files: newFiles },
                }));

                field.onChange(newFiles);
              }}
              handleRemoveImage={(idx) => {
                const updatedFiles = media.images.files.filter(
                  (_, index) => index !== idx
                );
                const updatedPreviews = media.images.previews.filter(
                  (_, index) => index !== idx
                );

                setMedia((prev) => ({
                  ...prev,
                  images: {
                    previews: updatedPreviews,
                    files: updatedFiles,
                  },
                }));
                field.onChange(updatedFiles);
              }}
              rightIcon={
                <UploadCloudIcon className="stroke-primary opacity-50 group-hover:opacity-100" />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="videos"
          defaultValue={[]}
          render={({ field }) => (
            <VideoInput
              name={"videos"}
              label="Videos"
              placeholder="Select Videos"
              acceptableFiles={ALLOWED_VIDEO_TYPES}
              previews={[
                ...media.videos.previews.map((p) => ({
                  url: p,
                  type: "video" as const,
                })),
              ]}
              errors={
                Array.isArray(errors.videos)
                  ? errors.videos.map((err) => err.message)
                  : errors.videos?.message
                  ? [errors.videos.message]
                  : []
              }
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const previews = files.map((file) => URL.createObjectURL(file));

                const newFiles = [...media.videos.files, ...files];
                const newPreviews = [...media.videos.previews, ...previews];

                setMedia((prev) => ({
                  ...prev,
                  videos: { previews: newPreviews, files: newFiles },
                }));
                field.onChange(newFiles);
              }}
              handleRemoveImage={(idx) => {
                const updatedFiles = media.videos.files.filter(
                  (_, index) => index !== idx
                );
                const updatedPreviews = media.videos.previews.filter(
                  (_, index) => index !== idx
                );

                setMedia((prev) => ({
                  ...prev,
                  videos: {
                    previews: updatedPreviews,
                    files: updatedFiles,
                  },
                }));
                field.onChange(updatedFiles);
              }}
              rightIcon={
                <UploadCloudIcon className="stroke-primary opacity-50 group-hover:opacity-100" />
              }
            />
          )}
        />
        <Button content="Submit" pattern="primary" type="submit" />
      </form>
    </Modal>
  );
};

export default AddReviewModal;
