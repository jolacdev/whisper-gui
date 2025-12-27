import { FileMetadata } from './pywebview-api';

// NOTE: This type has to be sync with the backend PyWebViewState state attributes.
export type PyWebViewStateProperties = {
  transcriptionFile: FileMetadata | null;
  transcriptionProgress: null | number;
  transcriptionRemainingSeconds: null | number;
  isAbortRequested: boolean | null;
};

// NOTE: Dummy object used only to extract the keys of the PyWebViewStateProperties type.
const dummyPyWebViewStateProperties: PyWebViewStateProperties = {
  transcriptionFile: null,
  transcriptionProgress: null,
  transcriptionRemainingSeconds: null,
  isAbortRequested: null,
};

// NOTE: List of keys of the PyWebViewStateProperties type.
export const stateKeys = Object.keys(
  dummyPyWebViewStateProperties,
) as (keyof PyWebViewStateProperties)[];

export type PyWebViewStateEventDetail = {
  [T in keyof PyWebViewStateProperties]: {
    key: T;
    value: PyWebViewStateProperties[T];
  };
}[keyof PyWebViewStateProperties];

export type PyWebViewState = EventTarget &
  PyWebViewStateProperties & {
    addEventListener(
      type: 'change',
      callback: (event: CustomEvent<PyWebViewStateEventDetail>) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
    addEventListener(
      type: 'delete',
      callback: (event: CustomEvent<PyWebViewStateEventDetail>) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
    removeEventListener(
      type: 'change',
      callback: (event: CustomEvent<PyWebViewStateEventDetail>) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
    removeEventListener(
      type: 'delete',
      callback: (event: CustomEvent<PyWebViewStateEventDetail>) => void,
      options?: AddEventListenerOptions | boolean,
    ): void;
  };
