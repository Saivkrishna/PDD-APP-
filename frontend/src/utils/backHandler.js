import { useEffect } from 'react';

export const backHandlerStack = [];

export function useBackHandler(handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    backHandlerStack.push(handler);
    return () => {
      const idx = backHandlerStack.indexOf(handler);
      if (idx > -1) backHandlerStack.splice(idx, 1);
    };
  }, [handler, isActive]);
}
