import type { IInput, ITitleDescription } from '@beautinique/frontend-components';
import type Quill from 'quill';
import type { ToolbarProps } from 'quill/modules/toolbar';
import type { RefObject } from 'react';
import type { FieldPath, FieldValues, UseFormSetValue } from 'react-hook-form';

import type { IQuillImageRef } from './component.type';

export type TToolbarOption =
  | { header: (1 | 2 | 3 | 4 | 5 | 6 | false)[] }
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | { list: 'ordered' | 'bullet' }
  | { script: 'sub' | 'super' }
  | { indent: '-1' | '+1' }
  | { color: string[] } // can be empty for Quill to auto-generate colors
  | { background: string[] }
  | { align: string[] }
  | { direction: 'rtl' }
  | 'link'
  | 'image'
  | 'video'
  | 'code'
  | 'clean';

export type TQuillToolbar = (TToolbarOption | TToolbarOption[])[];

export interface IToolBarOptions {
  header?: (1 | 2 | 3 | 4 | 5 | 6 | false)[];
  script?: ('sub' | 'super')[];
  indent?: ('-1' | '+1')[];
  color?: boolean;
  background?: boolean;
  align?: boolean;
  direction?: 'rtl';
  text?: ('bold' | 'italic' | 'underline' | 'strike' | 'link')[];
  list?: ('ordered' | 'bullet')[];
  media?: ('image' | 'video' | 'link')[];
  misc?: ('code' | 'clean')[];
}

export interface IQuillInput
  extends
    Pick<IInput, 'error' | 'label' | 'className'>,
    Pick<IInput['inputProps'], 'placeholder' | 'disabled'> {
  value?: string;
  needLinkButton?: boolean;
  onChange?: (value: string) => void;
  imagesRef?: RefObject<IQuillImageRef[]>;
  toolbarOptions?: IToolBarOptions;
}

export interface IQuillToolbar extends ToolbarProps {
  handlers: Record<string, (...args: unknown[]) => void>;
}

export interface IQuillImageBlot {
  new (): HTMLElement;
  create(value: unknown): HTMLElement;
  value(node: HTMLElement): unknown;
}

export interface IProcessQuillContent<T extends FieldValues> {
  quillRef: RefObject<Quill | null>;
  imagesRef: RefObject<IQuillImageRef[]>;
  setValue: UseFormSetValue<T>;
  field: FieldPath<T>;
  folder: string;
  toasterInfo?: Partial<ITitleDescription>;
}
