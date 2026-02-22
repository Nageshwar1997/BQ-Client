import z, { type RefinementCtx } from 'zod';
import type {
  IZodEnumsConfigs,
  IZodFileConfigs,
  IZodMultipleFilesConfigs,
  IZodSingleFileConfigs,
  IZodStringConfigs,
  ZodNumberConfigs,
} from '../Types';
import {
  ALLOWED_IMAGE_FORMATS,
  ALLOWED_VIDEO_FORMATS,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MB,
  regexes,
} from '../Constants';
import { nullCheck } from './common';

export const zodCustomIssue = (
  ctx: RefinementCtx,
  message: string,
  fieldPath?: string | number,
) => {
  const path = fieldPath !== undefined ? [fieldPath] : [];
  return ctx.addIssue({ path, code: 'custom', message });
};

export const zodString = ({
  field,
  label,
  nonEmpty = true,
  min,
  max,
  allowSpace = true,
  parentField,
  parentLabel,
  customRegexes,
  lowerOrUpper,
}: IZodStringConfigs) => {
  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;

  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  const messages = {
    required: `${name} is required.`,
    invalid_type: `${name} must be a string.`,
    non_empty: `${name} cannot be empty.`,
    min: `${name} must be at least ${min} characters.`,
    max: `${name} must not exceed ${max} characters.`,
    multiple_spaces: `${name} must not contain multiple consecutive spaces.`,
    single_space: `${name} must not contain any spaces.`,
    custom: `${name}`,
  };

  let schema = z
    .string(messages.required)
    .trim()
    .refine((val) => typeof val === 'string', { message: messages.invalid_type });

  if (nonEmpty) {
    schema = schema.nonempty({ message: messages.required });
  }

  if (nonEmpty && min !== undefined) {
    schema = schema.min(min, messages.min);
  }

  if (nonEmpty && max !== undefined) {
    schema = schema.max(max, messages.max);
  }

  if (allowSpace === true) {
    schema = schema.regex(regexes.singleSpace, messages.multiple_spaces);
  } else if (allowSpace === false) {
    schema = schema.regex(regexes.noSpace, messages.single_space);
  }

  if (lowerOrUpper === 'lower') {
    schema = schema.toLowerCase();
  } else if (lowerOrUpper === 'upper') {
    schema = schema.toUpperCase();
  }

  if (customRegexes?.length) {
    customRegexes.forEach(({ regex, message }) => {
      schema = schema.regex(regex, `${messages.custom} ${message}.`);
    });
  }

  return schema;
};

export const zodNumber = ({
  field,
  label,
  parentField,
  parentLabel,
  min,
  max,
  int = false,
  positive = true,
}: ZodNumberConfigs) => {
  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;

  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  const messages = {
    required: `${name} is required.`,
    invalid_type: `${name} must be a number.`,
    positive: `${name} must be a positive number.`,
    int: `${name} must be an integer.`,
    min: `${name} must be at least ${min}.`,
    max: `${name} must not exceed ${max}.`,
  };

  let schema = z.number({ error: messages.required }).refine((val) => !isNaN(val), {
    message: messages.invalid_type,
  });

  if (positive) {
    schema = schema.positive({ message: messages.positive });
  }

  if (int) {
    schema = schema.int({ message: messages.int });
  }

  if (min !== undefined) {
    schema = schema.min(min, { message: messages.min });
  }

  if (max !== undefined) {
    schema = schema.max(max, { message: messages.max });
  }

  return schema;
};

export const zodEnum = ({
  enumValues,
  field,
  label,
  parentField,
  parentLabel,
}: IZodEnumsConfigs) => {
  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;

  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  return z.enum(enumValues, {
    error: `${name} is required. Must be one of: ${enumValues.join(', ')}.`,
  });
};

export const zodFileOrUrl = (props: IZodFileConfigs) => {
  const {
    fileOrUrl,
    field,
    index,
    ctx,
    label,
    parentField,
    parentLabel,
    required = true,
    maxImageFileSize = MAX_IMAGE_FILE_SIZE,
    maxVideoFileSize = MAX_VIDEO_FILE_SIZE,
  } = props;
  let isVideo = false;
  const path = nullCheck(index) ? index : undefined;

  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;

  const name = nullCheck(index)
    ? parentName
      ? `${parentName}: ${baseName} ${index + 1}`
      : `${baseName} ${index + 1}`
    : parentName
      ? `${parentName}: ${baseName}`
      : baseName;

  const isFileOrUrl =
    typeof fileOrUrl === 'string' ? 'URL ' : fileOrUrl instanceof File ? 'File ' : '';

  if (!fileOrUrl) {
    if (required) {
      zodCustomIssue(ctx, `${isFileOrUrl}${name} is required.`, path);
    }
    return;
  }

  if (typeof File !== 'undefined' && fileOrUrl instanceof File) {
    // detect type
    isVideo = ALLOWED_VIDEO_FORMATS.includes(fileOrUrl.type);

    // type check
    const allowedTypes = isVideo ? ALLOWED_VIDEO_FORMATS : ALLOWED_IMAGE_FORMATS;
    if (!allowedTypes.includes(fileOrUrl.type)) {
      zodCustomIssue(
        ctx,
        `${isVideo ? 'Video' : 'Image'} ${name} invalid format. Allowed formats: ${allowedTypes
          .map((t) => t.split('/')[1])
          .join(', ')}`,
        path,
      );
    }

    // size check
    const maxSize = isVideo ? maxVideoFileSize : maxImageFileSize;
    if (fileOrUrl.size > maxSize) {
      const sizeInMB = (fileOrUrl.size / MB).toFixed(2);
      zodCustomIssue(
        ctx,
        `${
          isVideo ? 'Video' : 'Image'
        } ${name} is too large (${sizeInMB} MB). Max allowed is ${maxSize / MB} MB.`,
        path,
      );
    }
  } else if (typeof fileOrUrl === 'string' && !regexes.url.test(fileOrUrl)) {
    zodCustomIssue(ctx, `Media ${name} is not a valid URL`, path);
  } else {
    zodCustomIssue(ctx, `Item ${name} must be a File or a valid media URL`, path);
  }
};

export const zodSingleFileOrUrl = ({
  field,
  label,
  required = true,
  parentLabel,
  parentField,
  maxImageFileSize = MAX_IMAGE_FILE_SIZE,
  maxVideoFileSize = MAX_VIDEO_FILE_SIZE,
}: IZodSingleFileConfigs) => {
  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;

  const name = parentName ? `${parentName}: ${baseName}` : baseName;
  return z.unknown().superRefine((value, ctx) => {
    let fileOrUrl = value;

    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      if (value.length === 0) {
        fileOrUrl = undefined;
      } else if (value.length > 1) {
        zodCustomIssue(ctx, `${name} allows only one file.`);
        return;
      } else {
        fileOrUrl = value[0];
      }
    }

    zodFileOrUrl({
      fileOrUrl,
      ctx,
      field,
      label,
      maxImageFileSize,
      maxVideoFileSize,
      parentLabel,
      parentField,
      required,
    });
  });
};

export const zodMultipleFileOrUrl = ({
  field,
  label,
  required = true,
  parentLabel,
  parentField,
  maxImages = 5,
  maxVideos = 5,
  maxImageFileSize = MAX_IMAGE_FILE_SIZE,
  maxVideoFileSize = MAX_VIDEO_FILE_SIZE,
}: IZodMultipleFilesConfigs) => {
  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;
  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  return z.unknown().superRefine((value, ctx) => {
    let filesOrUrls: Array<File | string> = [];

    if (typeof FileList !== 'undefined' && value instanceof FileList) {
      filesOrUrls = Array.from(value);
    } else if (Array.isArray(value)) {
      filesOrUrls = value;
    } else if (!value) {
      filesOrUrls = [];
    } else {
      zodCustomIssue(ctx, `${name} must be files or URLs.`);
      return;
    }

    if (required && filesOrUrls.length === 0) {
      zodCustomIssue(ctx, `${name} is required.`);
      return;
    }

    if (!required && filesOrUrls.length === 0) return;

    let imageCount = 0;
    let videoCount = 0;

    filesOrUrls.forEach((fileOrUrl, index) => {
      if (fileOrUrl instanceof File) {
        if (ALLOWED_IMAGE_FORMATS.includes(fileOrUrl.type)) imageCount++;
        else if (ALLOWED_VIDEO_FORMATS.includes(fileOrUrl.type)) videoCount++;
      }

      zodFileOrUrl({
        fileOrUrl,
        ctx,
        field,
        index,
        label,
        maxImageFileSize,
        maxVideoFileSize,
        parentLabel,
        parentField,
        required,
      });
    });

    // Image limit
    if (maxImages !== undefined && imageCount > maxImages) {
      zodCustomIssue(ctx, `${name} allows maximum ${maxImages} image${maxImages > 1 ? 's' : ''}.`);
    }

    // Video limit
    if (maxVideos !== undefined && videoCount > maxVideos) {
      zodCustomIssue(ctx, `${name} allows maximum ${maxVideos} video${maxVideos > 1 ? 's' : ''}.`);
    }
  });
};
