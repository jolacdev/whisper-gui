import { FileMetadata } from './pywebview-api';

// NOTE: This type has to be sync with the backend PyWebViewState state attributes.
export type PyWebViewStateProperties = {
  transcriptionFile: FileMetadata | null;
  transcriptionProgress: null | number;
};

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
