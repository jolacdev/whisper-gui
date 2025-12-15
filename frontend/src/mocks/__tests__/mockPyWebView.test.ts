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
    vi.useFakeTimers();

    const transcriptionPromise = window.pywebview.api.run_transcription(
      'dummyPath',
      'dummyModel',
    );

    await vi.runAllTimersAsync();
    const segments = await transcriptionPromise;

    expect(segments).toHaveLength(3);

    vi.useRealTimers();
  });

  it('should update transcriptionProgress during run_transcription', async () => {
    vi.useFakeTimers();
    const stepDelayMs = 500;
    const initialDelayMs = stepDelayMs * 5;

    const transcriptionPromise = window.pywebview.api.run_transcription(
      'dummyPath',
      'dummyModel',
    );

    expect(window.pywebview.state.transcriptionProgress).toBeNull();

    // Wait for initial step
    await vi.advanceTimersByTimeAsync(initialDelayMs);
    expect(window.pywebview.state.transcriptionProgress).toBe(0);

    // Advance partially
    await vi.advanceTimersByTimeAsync(stepDelayMs * 5);
    expect(window.pywebview.state.transcriptionProgress).toBeGreaterThan(0);
    expect(window.pywebview.state.transcriptionProgress).toBeLessThan(100);

    // Advance remaining steps
    await vi.advanceTimersByTimeAsync(stepDelayMs * 10);
    expect(window.pywebview.state.transcriptionProgress).toBe(100);

    const segments = await transcriptionPromise;

    expect(window.pywebview.state.transcriptionProgress).toBe(100);
    expect(segments).toHaveLength(3);

    vi.useRealTimers();
  });
});
