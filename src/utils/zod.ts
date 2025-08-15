import z from "zod";
import { regexes } from "../constants";
import { ZodCompareConfigs, ZodRequiredStringConfigs } from "../types/zod";

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
