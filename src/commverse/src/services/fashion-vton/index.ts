import { useMutation } from '@tanstack/react-query';
import { checkVtonHealth, generateFashionVton } from '../api';

export const useCheckVtonHealth = () => {
  return useMutation({
    mutationKey: ['check-vton-health'],
    mutationFn: checkVtonHealth,
    retry: false,
  });
};

export const useGenerateFashionVton = () => {
  return useMutation({
    mutationKey: ['generate-fashion-vton'],
    mutationFn: generateFashionVton,
    retry: false,
  });
};
