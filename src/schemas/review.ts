import z from "zod";
import { zodFileOrUrl, zodStringRequired } from "../utils/zod";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "../constants";

export const addReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
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
  media: z
    .array(z.union([z.instanceof(File), z.string()]))
    .superRefine((files, ctx) => {
      let images = 0;
      let videos = 0;

      files.forEach((file) => {
        if (file instanceof File) {
          if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
            images++;
          } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
            videos++;
          }
        }
      });
      if (images > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You can upload a maximum of 5 images",
        });
      } else if (videos > 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You can upload a maximum of 5 videos",
        });
      } else {
        files.forEach((file, index) => {
          zodFileOrUrl({ fileOrUrl: file, field: "media", ctx, index });
        });
      }
    })
    .optional()
    .default([]),
});
