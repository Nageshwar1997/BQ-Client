interface ZodCommonConfigs {
  field: string;
  parentField?: string;
  showingFieldName: string;
  showingParentFieldName?: string;
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
