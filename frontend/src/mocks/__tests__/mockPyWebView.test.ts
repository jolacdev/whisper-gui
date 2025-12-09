import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createPyWebViewMock } from '../mockPyWebView';

describe('mockPyWebView (API and State)', () => {
  const listener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    createPyWebViewMock();
    window.pywebview.state.addEventListener('change', listener);
  });

  afterEach(() => {
    window.pywebview.state.removeEventListener('change', listener);
  });

  it('should dispatch change event when a state property is set', () => {
    const expectedObject = {
      key: 'transcriptionFile',
      value: {
        absolutePath: '/path/to/test.mp3',
        name: 'test.mp3',
        size: 100,
        type: 'audio',
      },
    };

    window.pywebview.state.transcriptionFile = expectedObject.value;

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual(expectedObject);
  });

  it('should simulate file selection and update pywebview.state.transcriptionFile', async () => {
    const file = await window.pywebview.api.open_file_dialog();

    expect(file).toBeDefined();
    expect(window.pywebview.state.transcriptionFile).toEqual(file);

    expect(listener).toHaveBeenCalled();
    const event = listener.mock.calls[0][0] as CustomEvent;
    expect(event.detail.key).toBe('transcriptionFile');
    expect(event.detail.value).toEqual(file);
  });

  it('should simulate transcription and return mocked segments', async () => {
    const segments = await window.pywebview.api.run_transcription(
      'dummyPath',
      'dummyModel',
    );

    expect(segments).toHaveLength(3);
  });
});
