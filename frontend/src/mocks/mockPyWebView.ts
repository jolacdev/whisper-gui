import {
  FileMetadata,
  PyWebViewApi,
  TranscriptionSegment,
} from 'types/pywebview/pywebview-api';
import { PyWebViewState } from 'types/pywebview/pywebview-state';

const eventTarget = new EventTarget();

const baseState: PyWebViewState = {
  transcriptionAbort: null,
  transcriptionFile: null,
  transcriptionProgress: null,
  addEventListener(type, callback, options) {
    eventTarget.addEventListener(type, callback as EventListener, options);
  },
  dispatchEvent(event) {
    return eventTarget.dispatchEvent(event);
  },
  removeEventListener(type, callback, options) {
    eventTarget.removeEventListener(type, callback as EventListener, options);
  },
};

// Wrap baseState in a Proxy to intercept property sets and automatically dispatch `change` events
const mockState = new Proxy(baseState, {
  set(target, prop: string, value) {
    // Set the value on the actual target.
    Reflect.set(target, prop, value); // Equals to: target[prop] = value;

    // Mimic PyWebView behavior by automatically dispatching a `change` event on property set.
    target.dispatchEvent(
      new CustomEvent('change', {
        detail: { key: prop, value },
      }),
    );

    return true;
  },
});

const mockApi: PyWebViewApi = {
  open_file_dialog: (): Promise<FileMetadata | null> => {
    const mockFile: FileMetadata = {
      name: 'The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001.Extended.1080p.BluRay.DTS.x264-UltraHD.Remastered.avi',
      size: 1887436,
      type: 'video',
      absolutePath:
        '/home/User/The.Lord.of.the.Rings.The.Fellowship.of.the.Ring.2001.Extended.1080p.BluRay.DTS.x264-UltraHD.Remastered.avi',
    };

    mockState.transcriptionFile = mockFile;
    return Promise.resolve(mockFile);
  },
  run_transcription: async (
    _file_path: string,
    _model_name: string,
  ): Promise<TranscriptionSegment[]> => {
    const delayPerStep = 500;
    const totalSteps = 15;

    // Simulate progress updates from 0% to 100%
    for (let step = 0; step <= totalSteps; step++) {
      mockState.transcriptionProgress = Math.round((step / totalSteps) * 100);
      await new Promise((resolve) => setTimeout(resolve, delayPerStep));
    }

    const mockSegments: TranscriptionSegment[] = [
      {
        id: 1,
        end: 7.44,
        start: 0,
        text: 'Text 1',
      },
      {
        id: 2,
        end: 14.16,
        start: 7.44,
        text: 'Text 2',
      },
      {
        id: 3,
        end: 22.46,
        start: 17.37,
        text: 'Text 3',
      },
    ];

    return mockSegments;
  },
};

export const createPyWebViewMock = () => {
  window.pywebview = {
    api: mockApi,
    state: mockState,
  };
};
