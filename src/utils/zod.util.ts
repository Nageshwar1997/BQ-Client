import { REGEX } from '@/constants/regex.constants';
import type {
  IZodArrayConfigs,
  IZodDateConfigs,
  IZodEnumsConfigs,
  IZodNumberConfigs,
  IZodStringConfigs,
} from '@/types/zod.type';
import {
  array,
  date,
  number,
  string,
  union,
  enum as z_enum,
  ZodArray,
  ZodNumber,
  ZodString,
  ZodType,
  type RefinementCtx,
} from 'zod';

export const appendCustomIssue = (
  ctx: RefinementCtx,
  message: string,
  fieldPath?: string | number | (string | number)[],
) => {
  const path =
    fieldPath !== undefined && fieldPath !== null
      ? Array.isArray(fieldPath)
        ? fieldPath
        : [fieldPath]
      : [];
  return ctx.addIssue({ path, code: 'custom', message });
};

export const validateString = (props: IZodStringConfigs): ZodString => {
  const {
    field,
    label,
    allowSpace = 'singleSpace',
    customRegexes,
    customRegex,
    lowerOrUpper,
    max,
    min,
    nonEmpty = true,
    parentField,
    parentLabel,
  } = props;

  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;
  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  let schema = string({
    error: `${name} is required & must be a string.`,
  }).trim();

  if (nonEmpty) {
    schema = schema.nonempty({ message: `${name} is required.` });

    if (min !== undefined) {
      schema = schema.min(min, `${name} must be at least ${min} characters.`);
    }

    if (max !== undefined) {
      schema = schema.max(max, `${name} must not exceed ${max} characters.`);
    }
  }

  if (allowSpace === 'singleSpace') {
    schema = schema.regex(REGEX.SINGLE_SPACE, `${name} must not contain multiple spaces.`);
  } else if (allowSpace === 'noSpace') {
    schema = schema.regex(REGEX.NO_SPACE, `${name} must not contain spaces.`);
  }

  if (customRegexes?.length) {
    customRegexes.forEach(({ regex, message }) => {
      schema = schema.regex(regex, `${name} ${message}.`);
    });
  }

  if (customRegex) {
    schema = schema.regex(customRegex.regex, `${name} ${customRegex.message}.`);
  }

  if (lowerOrUpper === 'lower') {
    schema = schema.toLowerCase();
  } else if (lowerOrUpper === 'upper') {
    schema = schema.toUpperCase();
  }

  return schema;
};

export const validateNumber = (props: IZodNumberConfigs): ZodNumber => {
  const {
    field,
    label,
    min,
    max,
    parentField,
    parentLabel,
    isInt = false,
    isPositive = true,
    isNegative = false,
  } = props;

  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;
  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  let schema = number({ error: `${name} is required & must be a number.` });

  if (min !== undefined) {
    schema = schema.min(min, `${name} must be at least ${min}.`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${name} must not exceed ${max}.`);
  }

  if (isInt) {
    schema = schema.int(`${name} must be an integer.`);
  }

  if (isPositive) {
    schema = schema.positive(`${name} must be a positive number.`);
  }

  if (isNegative) {
    schema = schema.negative(`${name} must be a negative number.`);
  }

  return schema;
};

export const validateEnum = <T extends readonly [string, ...string[]]>({
  enumValues,
  field,
  label,
  parentField,
  parentLabel,
}: IZodEnumsConfigs<T>) => {
  return z_enum(enumValues, {
    error: (issue) => {
      const path = issue.path ?? [];

      // get index from path
      const index = [...path].reverse().find((p) => typeof p === 'number');

      // replace [some_index] with actual index
      const resolvedField =
        index !== undefined ? field.replace('[some_index]', String(index)) : field;
      const resolvedLabel =
        index !== undefined ? label.replace('[some_index]', String(index)) : label;

      const baseName = resolvedLabel || resolvedField;
      const parentName = parentLabel ?? parentField;

      const name = parentName ? `${parentName}: ${baseName}` : baseName;

      return `${name} is required. Must be one of: ${enumValues.join(', ')}.`;
    },
  });
};

export const validateUrl = (props: Omit<IZodStringConfigs, 'customRegexes'>): ZodString => {
  return validateString({
    ...props,
    customRegexes: [
      { regex: REGEX.URL, message: 'must be a valid URL' },
      { regex: REGEX.NO_SPACE, message: 'must not contain spaces' },
    ],
  });
};

export const validateDate = (props: IZodDateConfigs): ZodType<Date> => {
  const { field, label, parentField, parentLabel, minDate, maxDate } = props;

  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;
  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  // Accept Date + valid date string
  let schema = union([
    date(),
    string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: `${name} must be a valid date.`,
    }),
  ]).transform((val) => (val instanceof Date ? val : new Date(val)));

  // Min Date
  if (minDate) {
    schema = schema.refine((date) => date >= minDate, {
      message: `${name} must be after ${minDate.toDateString()}.`,
    });
  }

  // Max Date
  if (maxDate) {
    schema = schema.refine((date) => date <= maxDate, {
      message: `${name} must be before ${maxDate.toDateString()}.`,
    });
  }

  return schema;
};

export const validateArray = <T>(props: IZodArrayConfigs<T>): ZodArray<ZodType<T>> => {
  const { field, label, parentField, parentLabel, schema, min, max, nonEmpty = true } = props;

  const baseName = label ?? field;
  const parentName = parentLabel ?? parentField;
  const name = parentName ? `${parentName}: ${baseName}` : baseName;

  let arraySchema = array(schema, {
    error: `${name} is required & must be an array.`,
  });

  // nonEmpty
  if (nonEmpty) {
    arraySchema = arraySchema.nonempty({
      message: `${name} is required.`,
    });
  }

  // min length
  if (min !== undefined) {
    arraySchema = arraySchema.min(min, {
      message: `${name} must have at least ${min} items.`,
    });
  }

  // max length
  if (max !== undefined) {
    arraySchema = arraySchema.max(max, {
      message: `${name} must not exceed ${max} items.`,
    });
  }

  return arraySchema;
};
