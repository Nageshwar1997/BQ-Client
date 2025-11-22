import z from "zod";
import {
  zodFileOrUrl,
  zodNumberRequired,
  zodStringRequired,
} from "../utils/zod";
import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "../constants";

export const addReviewSchema = z.object({
  rating: zodNumberRequired({
    field: "rating",
    showingFieldName: "Rating",
    max: 5,
    min: 1,
    nonNegative: true,
  }),
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
          zodFileOrUrl({
            field: "media",
            ctx,
            fileOrUrl: file,
            index,
            showingFieldName: "Image/Video",
            required: false,
          });
        });
      }
    })
    .optional()
    .default([]),
});
