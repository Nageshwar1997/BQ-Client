import z from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MB,
  regexes,
} from "../constants";
import {
  ZodEnumsConfigs,
  ZodCompareConfigs,
  ZodRequiredNumberConfigs,
  ZodRequiredStringConfigs,
  ZodOptionalStringConfigs,
} from "../types/zod";

export const getZodStringMessages = (
  props: ZodCompareConfigs & { field: string }
) => {
  const { field, min, max } = props;
  return {
    required: `${field} is required.`,
    invalid_type: `${field} must be a string.`,
    non_empty: `${field} cannot be empty.`,
    min: `${field} must be at least ${min} characters.`,
    max: `${field} must not exceed ${max} characters.`,
    multiple_spaces: `${field} must not contain multiple consecutive spaces.`,
    single_space: `${field} must not contain any spaces.`,
    custom: `${field} `,
  };
};

export const getZodNumberMessages = (
  props: ZodCompareConfigs & { field: string }
) => {
  const { field, min, max } = props;
  return {
    required: `${field} is required.`,
    invalid_type: `${field} must be a number.`,
    nonNegative: `${field} must be a non-negative number.`,
    mustBeInt: `${field} must be an integer.`,
    min: `${field} must be at least ${min}.`,
    max: `${field} must not exceed ${max}.`,
  };
};

export const zodStringRequired = ({
  field,
  showingFieldName,
  showingParentFieldName,
  nonEmpty = true,
  min,
  max,
  blockSingleSpace,
  blockMultipleSpaces,
  parentField,
  customRegexes,
}: ZodRequiredStringConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;

  const messages = getZodStringMessages({ field: nestedField, min, max });

  let schema = z
    .string({
      required_error: messages.required,
      invalid_type_error: messages.invalid_type,
    })
    .trim()
    .min(1, messages.required);

  if (nonEmpty) {
    schema = schema.nonempty({ message: messages.non_empty });
  }

  if (nonEmpty && min !== undefined) {
    schema = schema.min(min, messages.min);
  }

  if (nonEmpty && max !== undefined) {
    schema = schema.max(max, messages.max);
  }

  if (blockMultipleSpaces) {
    schema = schema.regex(regexes.singleSpace, messages.multiple_spaces);
  }

  if (blockSingleSpace) {
    schema = schema.regex(regexes.noSpace, messages.single_space);
  }

  if (customRegexes?.length) {
    customRegexes.forEach(({ regex, message }) => {
      schema = schema.regex(regex, `${messages.custom} ${message}.`);
    });
  }

  return schema;
};

export const zodStringOptional = ({
  field,
  showingFieldName,
  showingParentFieldName,
  nonEmpty = true,
  min,
  max,
  blockSingleSpace,
  blockMultipleSpaces,
  parentField,
  customRegexes,
}: ZodOptionalStringConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;
  const messages = getZodStringMessages({ field: nestedField, min, max });

  const schema = z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val === undefined || val === null || val === "") return;

      if (typeof val !== "string") {
        return ctx.addIssue({
          code: "custom",
          message: messages.invalid_type,
        });
      }

      if (nonEmpty && val.trim().length === 0) {
        ctx.addIssue({ code: "custom", message: messages.non_empty });
      }

      if (nonEmpty && min !== undefined && val.length < min) {
        ctx.addIssue({ code: "custom", message: messages.min });
      }

      if (nonEmpty && max !== undefined && val.length > max) {
        ctx.addIssue({ code: "custom", message: messages.max });
      }

      if (blockMultipleSpaces && !regexes.singleSpace.test(val)) {
        ctx.addIssue({ code: "custom", message: messages.multiple_spaces });
      }

      if (blockSingleSpace && !regexes.noSpace.test(val)) {
        ctx.addIssue({ code: "custom", message: messages.single_space });
      }

      if (customRegexes?.length) {
        customRegexes.forEach(
          ({ regex, message }: { regex: RegExp; message: string }) => {
            if (!regex.test(val)) {
              ctx.addIssue({
                code: "custom",
                message: `${messages.custom} ${message}.`,
              });
            }
          }
        );
      }
    });

  return schema;
};

export const zodNumberRequired = ({
  field,
  parentField,
  showingFieldName,
  showingParentFieldName,
  min,
  max,
  mustBeInt = false,
  nonNegative = true,
}: ZodRequiredNumberConfigs) => {
  const readableField = showingFieldName ?? field;
  const readableParent = showingParentFieldName ?? parentField;

  const nestedField = readableParent
    ? `${readableParent}${
        readableParent.includes("[") ? " " : ": "
      }${readableField}`
    : readableField;

  const messages = getZodNumberMessages({ field: nestedField, min, max });

  const schema = z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === "" || val === null || val === undefined)
        return { value: NaN, reason: "required" };
      const num = Number(val);
      return isNaN(num)
        ? { value: NaN, reason: "invalid" }
        : { value: num, reason: null };
    })
    .superRefine(({ value, reason }, ctx) => {
      if (isNaN(value)) {
        ctx.addIssue({
          code: "custom",
          message:
            reason === "required" ? messages.required : messages.invalid_type,
        });
        return;
      }

      if (nonNegative && value < 0) {
        ctx.addIssue({
          code: "custom",
          message: messages.nonNegative,
        });
      }

      if (mustBeInt && !Number.isInteger(value)) {
        ctx.addIssue({
          code: "custom",
          message: messages.mustBeInt,
        });
      }

      if (min !== undefined && value < min) {
        ctx.addIssue({
          code: "custom",
          message: messages.min,
        });
      }

      if (max !== undefined && value > max) {
        ctx.addIssue({
          code: "custom",
          message: messages.max,
        });
      }
    })
    .transform(({ value }) => value);

  return schema;
};

export function zodFileOrUrl({
  fileOrUrl,
  field,
  index,
  ctx,
  required = true,
}: {
  fileOrUrl: unknown;
  field: string;
  index?: number;
  ctx: z.RefinementCtx;
  required?: boolean;
}) {
  let isVideo = false;
  const path: (string | number)[] = index !== undefined ? [index] : [];
  const name = index !== undefined && index !== null ? index + 1 : field;
  const isFileOrUrl =
    typeof fileOrUrl === "string"
      ? "url"
      : fileOrUrl instanceof File
      ? "file"
      : "unknown";

  if (!fileOrUrl) {
    if (required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Media ${isFileOrUrl} ${name} is required.`,
        path,
      });
    }
    return;
  }

  if (typeof File !== "undefined" && fileOrUrl instanceof File) {
    // detect type
    isVideo = ALLOWED_VIDEO_TYPES.includes(fileOrUrl.type);

    // type check
    const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(fileOrUrl.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${
          isVideo ? "Video" : "Image"
        } ${name} invalid format. Allowed formats: ${allowedTypes
          .map((t) => t.split("/")[1])
          .join(", ")}`,
        path,
      });
    }

    // size check
    const maxSize = isVideo ? MAX_VIDEO_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
    if (fileOrUrl.size > maxSize) {
      const sizeInMB = (fileOrUrl.size / MB).toFixed(1);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${
          isVideo ? "Video" : "Image"
        } ${name} is too large (${sizeInMB} MB). Max allowed is ${
          maxSize / MB
        } MB.`,
        path,
      });
    }
  } else if (typeof fileOrUrl === "string") {
    try {
      const url = new URL(fileOrUrl);
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error();
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Media ${name} is not a valid URL`,
        path,
      });
    }
  } else {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Item ${name} must be a File or a valid media URL`,
      path,
    });
  }
}

export const zodEnums = (props: ZodEnumsConfigs & { enums: string[] }) => {
  return z.enum([props.enums[0], ...props.enums.slice(1)], {
    errorMap: () => ({
      message: `Invalid option. Must be '${props.enums.join(", ")}'.`,
    }),
  });
};
