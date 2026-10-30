import { createContext } from 'react';

export const SmoothScrollContext = createContext({
  getLenis: () => null,
  scrollTo: () => {},
  onScroll: () => () => {},
});
