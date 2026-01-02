import z from "zod";
import {
  multipleFilesOrUrlsValidation,
  zodNumberRequired,
  zodStringRequired,
} from "../utils/zod";

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
  media: multipleFilesOrUrlsValidation({
    field: "media",
    maxImages: 5,
    maxVideos: 5,
    showingFieldName: "Image/Video",
    required: false,
  })
    .optional()
    .default([]),
});
