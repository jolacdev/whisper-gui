import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

import {
  TRANSCRIPTION_PROGRESS_MAX_VALUE,
  TRANSCRIPTION_PROGRESS_MIN_VALUE,
} from '@constants';

type ProgressLoaderProps = {
  value: number;
  size?: CSSProperties['width'];
  isProgressTextVisible?: boolean;
  isTrackVisible?: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const ProgressLoader = ({
  size = '12rem',
  value,
  isProgressTextVisible = true,
  isTrackVisible = true,
}: ProgressLoaderProps) => {
  const { t } = useTranslation();

  const clampedValue = clamp(
    value,
    TRANSCRIPTION_PROGRESS_MIN_VALUE,
    TRANSCRIPTION_PROGRESS_MAX_VALUE,
  );

  return (
    <div
      aria-valuemax={TRANSCRIPTION_PROGRESS_MAX_VALUE}
      aria-valuemin={TRANSCRIPTION_PROGRESS_MIN_VALUE}
      aria-valuenow={clampedValue}
      className="relative"
      role="progressbar"
    >
      {isTrackVisible && (
        <div
          className="radial-progress text-charcoal-800 absolute"
          style={
            {
              '--size': size,
              '--value': TRANSCRIPTION_PROGRESS_MAX_VALUE,
            } as CSSProperties
          }
        />
      )}

      <div
        className="radial-progress text-primary"
        style={
          {
            '--size': size,
            '--value': clampedValue,
          } as CSSProperties
        }
      >
        {isProgressTextVisible && (
          <span className="text-primary-content text-4xl">
            {t('shared.progressLoader.value', { value: clampedValue })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressLoader;
