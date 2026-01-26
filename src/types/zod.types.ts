import type { RefinementCtx } from 'zod';

type TZodCommonBaseConfigs = {
  field: string;
  parentField?: string;
  label: string;
  parentLabel?: string;
};

export type TZodCompareConfigs = { min?: number; max?: number };
export type TZodRegex = { regex: RegExp; message: string };

export interface IZodEnumsConfigs extends TZodCommonBaseConfigs {
  enumValues: readonly string[];
}

export interface IZodSingleFileConfigs extends TZodCommonBaseConfigs {
  required?: boolean;
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

export interface ZodNumberConfigs extends TZodCommonBaseConfigs, TZodCompareConfigs {
  int?: boolean;
  positive?: boolean;
}
