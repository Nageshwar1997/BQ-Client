import type {
  IButton,
  IChildren,
  IClassName,
  IContainerClassName,
} from '@beautinique/frontend-components';
import type { ReactElement, ReactNode } from 'react';

import type { TCategory } from './api.type';

export interface ICatModal {
  category: TCategory;
  mainCatId?: string;
}

export interface ICatActionHandle {
  onEdit: (data: ICatModal) => void;
  onDelete: (categoryId: string) => void;
}

export type TCatTable = ICatActionHandle & ICatModal;

export interface IPageWrapper extends IChildren, IContainerClassName, IClassName {
  navbar?: {
    components?: ReactElement[];
    buttons?: Partial<IButton & IChildren>[];
  } & Partial<IChildren>;
}

export interface INavbar extends IClassName, Partial<IChildren> {
  components?: ReactNode[];
  buttons?: Partial<IButton & IChildren>[];
}
