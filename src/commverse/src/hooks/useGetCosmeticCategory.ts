import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { SUPPORTED_TRYON_CATEGORIES } from '../constants';
import type { TTryOn } from '../types';

export const useGetCosmeticCategory = (): {
  categoryId: string;
  expId?: string;
  subCategory: TTryOn;
  isEyelinerOrKajal?: boolean;
} => {
  const { category = '', subCategory = '', expId = '' } = useParams();
  const navigate = useNavigate();

  const isValidCategory = SUPPORTED_TRYON_CATEGORIES.includes(
    subCategory as string as TTryOn
  );

  const isEyelinerOrKajal = ['Eyeliner', 'Kajal'].includes(subCategory);

  useEffect(() => {
    if (!isValidCategory && !expId) {
      navigate('/virtual-try-on', { replace: true });
    }
  }, [isValidCategory, navigate, expId]);

  return {
    categoryId: category,
    expId,
    subCategory: subCategory as TTryOn,
    isEyelinerOrKajal,
  };
};
