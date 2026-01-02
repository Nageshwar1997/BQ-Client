import { RefinementCtx } from "zod";

export interface ZodCommonConfigs {
  field: string;
  parentField?: string;
  showingFieldName: string;
  showingParentFieldName?: string;
}

export interface ZodFileConfigs extends ZodCommonConfigs {
  maxVideoFileSize?: number;
  maxImageFileSize?: number;
  fileOrUrl: unknown;
  index?: number;
  ctx: RefinementCtx;
  required?: boolean;
}

export type ZodSingleFileConfigs = Omit<
  ZodFileConfigs,
  "index" | "ctx" | "fileOrUrl"
>;

export interface ZodMultipleFileConfigs extends ZodSingleFileConfigs {
  maxImages?: number;
  maxVideos?: number;
}

export interface ZodCompareConfigs {
  min?: number | undefined;
  max?: number | undefined;
}

export type TZodRegex = {
  regex: RegExp;
  message: string;
};

export interface ZodStringConfigs extends ZodCommonConfigs, ZodCompareConfigs {
  blockMultipleSpaces?: boolean;
  blockSingleSpace?: boolean;
  nonEmpty?: boolean;
  customRegexes?: TZodRegex[];
}

export interface ZodNumberConfigs extends ZodCommonConfigs, ZodCompareConfigs {
  mustBeInt?: boolean;
  nonNegative?: boolean;
}

// String
export type ZodRequiredStringConfigs = ZodStringConfigs; // Required
export type ZodOptionalStringConfigs = ZodStringConfigs; // Optional

// Number
export type ZodRequiredNumberConfigs = ZodNumberConfigs; // Required
export type ZodOptionalNumberConfigs = ZodNumberConfigs; // Optional

// Enums
export type ZodEnumsConfigs = ZodCommonConfigs;
