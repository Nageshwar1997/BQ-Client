import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TClassName, TContainerClassName } from './component.type';
import type { InputHTMLAttributes, ReactNode } from 'react';
import type { IconProps } from '@iconify/react';

type LeftIcon = { left: IconProps | string; right?: never };

type RightIcon = { right: IconProps; left?: never };

type NoIcon = { left?: undefined; right?: undefined };

type InputIcons = LeftIcon | RightIcon | NoIcon;

export interface IBaseInput extends TClassName, TContainerClassName {
  needRef?: boolean;
  icons?: InputIcons;
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

export interface IInput extends IBaseInput {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}

export interface ICheckbox extends Omit<IBaseInput, 'needRef' | 'icons' | 'label'> {
  content?: string | ReactNode;
  checkboxProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;
}
