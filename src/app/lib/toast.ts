import { useToast as usePrismToast, IconType } from '@doordash/prism-react';

export function useAppToast() {
  const { displayToast } = usePrismToast();

  return {
    success: (message: string) => {
      displayToast({ text: message, icon: IconType.Check });
    },
    error: (message: string) => {
      displayToast({ text: message });
    },
    info: (message: string) => {
      displayToast({ text: message });
    },
    warning: (message: string) => {
      displayToast({ text: message });
    },
  };
}

export const toast = {
  success: (message: string) => {
    console.log('[Toast Success]', message);
  },
  error: (message: string) => {
    console.log('[Toast Error]', message);
  },
  info: (message: string) => {
    console.log('[Toast Info]', message);
  },
  warning: (message: string) => {
    console.log('[Toast Warning]', message);
  },
};
