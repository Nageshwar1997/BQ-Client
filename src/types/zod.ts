import type { RefinementCtx } from 'zod';

type TZodCommonBaseConfigs = {
  field: string;
  parentField?: string;
  label: string;
  parentLabel?: string;
};

export interface IZodCommonConfigs extends TZodCommonBaseConfigs {
  required?: boolean;
}

export type TZodCompareConfigs = { min?: number; max?: number };
export type TZodRegex = { regex: RegExp; message: string };

export interface IZodEnumsConfigs extends TZodCommonBaseConfigs {
  enumValues: readonly string[];
}

export interface IZodSingleFileConfigs extends IZodCommonConfigs {
  maxVideoFileSize?: number;
  maxImageFileSize?: number;
}

export interface IZodFileConfigs extends IZodSingleFileConfigs {
  fileOrUrl: unknown;
  index?: number;
  ctx: RefinementCtx;
}

export interface IZodStringConfigs extends TZodCommonBaseConfigs, TZodCompareConfigs {
  allowSpace?: boolean;
  nonEmpty?: boolean;
  customRegexes?: TZodRegex[];
  lowerOrUpper?: 'upper' | 'lower';
}

export interface ZodNumberConfigs extends IZodCommonConfigs, TZodCompareConfigs {
  int?: boolean;
  positive?: boolean;
}
