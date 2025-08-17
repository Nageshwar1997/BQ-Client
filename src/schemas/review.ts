import z from "zod";
import { zodFileOrUrl, zodStringRequired } from "../utils/zod";

export const addReviewSchema = z.object({
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
    .array(z.instanceof(File), z.string())
    .superRefine((files, ctx) => {
      files.forEach((file, index) =>
        zodFileOrUrl({ fileOrUrl: file, field: "media", ctx, index })
      );
    })
    .optional()
    .default([]),
});
