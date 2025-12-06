import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import { AudioFile } from '@icons/AudioFile';
import { Delete } from '@icons/Delete';
import { Draft } from '@icons/Draft';
import { VideoFile } from '@icons/VideoFile';

type MediaType = 'audio' | 'video';

type FilePreviewProps = {
  name: string;
  size: string;
  type: string;
  onDelete: () => void;
};

const iconMap: Record<MediaType, ReactElement> = {
  audio: <AudioFile />,
  video: <VideoFile />,
};

const isMediaType = (value: string): value is MediaType =>
  value === 'audio' || value === 'video';

const SelectedFilePreview = ({
  name,
  onDelete,
  size,
  type,
}: FilePreviewProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'fileSelector.selectedFilePreview',
  });

  const icon: ReactElement = isMediaType(type) ? iconMap[type] : <Draft />;

  return (
    <article className="hover:bg-charcoal-700 flex max-h-8 justify-between rounded-lg p-1 transition-colors duration-300 ease-in-out">
      <figure className="flex min-w-0 items-center gap-2">
        <div>{icon}</div>
        <div
          aria-label={`File size: ${size}`}
          className="border-charcoal-500 rounded-lg border-1 px-1 text-sm text-nowrap"
        >
          {size}
        </div>
        <figcaption aria-label={name} className="truncate text-sm" title={name}>
          {name}
        </figcaption>
      </figure>

      <Button
        aria-label={t('tooltip.delete')}
        className="btn-ghost"
        iconLeft={<Delete className="hover:fill-red-400" />}
        title={t('tooltip.delete')}
        onClick={onDelete}
      />
    </article>
  );
};

export default SelectedFilePreview;
