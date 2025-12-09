import { useEffect, useState } from 'react';

import {
  PyWebViewStateEventDetail,
  PyWebViewStateProperties,
} from 'types/pywebview/pywebview-state';

type UsePyWebViewProps<T extends keyof PyWebViewStateProperties> = {
  key: T;
  initialValue?: PyWebViewStateProperties[T];
};

// Overload with MANDATORY initialValue. Returns the key's possible values.
function usePyWebViewState<T extends keyof PyWebViewStateProperties>({
  initialValue,
  key,
}: UsePyWebViewProps<T> & {
  initialValue: PyWebViewStateProperties[T];
}): PyWebViewStateProperties[T];

// Overload with OPTIONAL initialValue. Returns the key's possible values or undefined.
function usePyWebViewState<T extends keyof PyWebViewStateProperties>({
  initialValue,
  key,
}: UsePyWebViewProps<T>): PyWebViewStateProperties[T] | undefined;

// Actual implementation
function usePyWebViewState<T extends keyof PyWebViewStateProperties>({
  initialValue,
  key,
}: UsePyWebViewProps<T>) {
  const [value, setValue] = useState<PyWebViewStateProperties[T] | undefined>(
    initialValue,
  );

  useEffect(() => {
    const handleValueChange = ({
      detail,
    }: CustomEvent<PyWebViewStateEventDetail>) => {
      if (detail.key === key) {
        setValue(detail.value as PyWebViewStateProperties[T]);
      }
    };

    window.pywebview.state.addEventListener('change', handleValueChange);

    return () => {
      window.pywebview.state.removeEventListener('change', handleValueChange);
    };
  }, [key]);

  return value;
}

export default usePyWebViewState;
