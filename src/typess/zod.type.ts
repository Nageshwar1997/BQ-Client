import { ZodType } from 'zod';

export type TZodCommonBaseConfigs = {
  field: string;
  parentField?: string;
  label: string;
  parentLabel?: string;
};

export type TZodCompareConfigs = { min?: number; max?: number };
export type TZodRegex = { regex: RegExp; message: string };

export interface IZodStringConfigs extends TZodCommonBaseConfigs, TZodCompareConfigs {
  allowSpace?: 'noSpace' | 'singleSpace' | 'anySpace';
  nonEmpty?: boolean;
  customRegexes?: TZodRegex[];
  customRegex?: TZodRegex;
  lowerOrUpper?: 'upper' | 'lower';
}

export interface IZodNumberConfigs extends TZodCommonBaseConfigs, TZodCompareConfigs {
  isInt?: boolean;
  isPositive?: boolean;
  isNegative?: boolean;
}

export interface IZodEnumsConfigs<
  T extends readonly [string, ...string[]],
> extends TZodCommonBaseConfigs {
  enumValues: T;
}

export interface IZodDateConfigs extends TZodCommonBaseConfigs {
  minDate?: Date;
  maxDate?: Date;
}

export interface IZodArrayConfigs<T> extends TZodCommonBaseConfigs {
  schema: ZodType<T>;
  min?: number;
  max?: number;
  nonEmpty?: boolean;
}
