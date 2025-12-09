import { KeyboardEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { handleAccessibleKeyPress } from '@utils/handleAccessibleKeyPress';

describe('handleAccessibleKeyPress', () => {
  const SUPPORTED_KEYS = ['Enter', ' '];
  const UNSUPPORTED_KEYS = [
    'ArrowUp',
    'Escape',
    'Tab',
    'a',
    'A',
    '0',
    'Backspace',
    'Delete',
    'Home',
    'End',
    'PageUp',
  ];

  const mockCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(SUPPORTED_KEYS)(
    'should invoke callback and return true when "%s" key is pressed',
    (key) => {
      const mockEvent = {
        key,
      } as KeyboardEvent<HTMLElement>;

      const isHandled = handleAccessibleKeyPress(mockEvent, mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(isHandled).toBe(true);
    },
  );

  it('should not invoke callback and return false when unsupported keys are pressed', () => {
    UNSUPPORTED_KEYS.forEach((key) => {
      mockCallback.mockClear();
      const mockEvent = {
        key,
      } as KeyboardEvent<HTMLElement>;

      const isHandled = handleAccessibleKeyPress(mockEvent, mockCallback);

      expect(mockCallback).not.toHaveBeenCalled();
      expect(isHandled).toBe(false);
    });
  });

  it('should invoke callback exactly once per key press', () => {
    const enterEvent = {
      key: 'Enter',
    } as KeyboardEvent<HTMLElement>;

    handleAccessibleKeyPress(enterEvent, mockCallback);
    handleAccessibleKeyPress(enterEvent, mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should handle different callbacks for different invocations', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    const mockEvent = {
      key: 'Enter',
    } as KeyboardEvent<HTMLElement>;

    handleAccessibleKeyPress(mockEvent, mockCallback1);
    handleAccessibleKeyPress(mockEvent, mockCallback2);

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
