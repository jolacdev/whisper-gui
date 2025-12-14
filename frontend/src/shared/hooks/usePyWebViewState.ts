import { useCallback, useEffect, useState } from 'react';

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
}): [PyWebViewStateProperties[T], (value: PyWebViewStateProperties[T]) => void];

// Overload with OPTIONAL initialValue. Returns the key's possible values or undefined.
function usePyWebViewState<T extends keyof PyWebViewStateProperties>({
  initialValue,
  key,
}: UsePyWebViewProps<T>): [
  PyWebViewStateProperties[T] | undefined,
  (value: PyWebViewStateProperties[T]) => void,
];

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

  // NOTE: This will update the local state by triggering the change event.
  const setPyWebViewValue = useCallback(
    (newValue: PyWebViewStateProperties[T]) => {
      // Only update if the value has changed.
      if (window.pywebview.state[key] !== newValue) {
        // @ts-expect-error - PyWebViewState is an intersection type, TS struggles to map T back to it
        window.pywebview.state[key] = newValue;
      }
    },
    [key],
  );

  return [value, setPyWebViewValue];
}

export default usePyWebViewState;
