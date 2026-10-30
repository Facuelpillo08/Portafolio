import { useContext } from 'react';
import { SmoothScrollContext } from '../context/scrollContext';

export function useLenis() {
  const context = useContext(SmoothScrollContext);
  return context || { getLenis: () => null, scrollTo: () => {}, onScroll: () => () => {} };
}
