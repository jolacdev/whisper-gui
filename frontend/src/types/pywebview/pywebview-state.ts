export type PyWebViewStateEventDetail = {
  key: string;
  value: unknown;
};

export type PyWebViewState = Record<string, unknown> &
  EventTarget & {
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
