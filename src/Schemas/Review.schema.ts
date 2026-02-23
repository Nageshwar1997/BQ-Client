import { zodMultipleFileOrUrl, zodNumber, zodString } from '@/Utils';
import { object } from 'zod';

export const addReviewSchema = object({
  rating: zodNumber({ field: 'rating', label: 'Rating', max: 5, min: 1 }),
  title: zodString({ field: 'title', label: 'Title', min: 2 }),
  comment: zodString({ field: 'comment', label: 'Comment', min: 10 }),
  media: zodMultipleFileOrUrl({ field: 'media', label: 'Image/Video', required: false })
    .optional()
    .default([]),
});
