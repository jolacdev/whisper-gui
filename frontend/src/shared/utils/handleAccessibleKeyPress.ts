import { type KeyboardEvent } from 'react';

const Keys = {
  Enter: 'Enter',
  Space: ' ',
} as const;

export const handleAccessibleKeyPress = (
  e: KeyboardEvent<HTMLElement>,
  callback: () => void,
) => {
  if (e.key === Keys.Enter || e.key === Keys.Space) {
    callback();
    return true;
  }

  return false;
};
