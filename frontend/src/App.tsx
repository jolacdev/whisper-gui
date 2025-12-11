import { useTranslation } from 'react-i18next';

import FileSelectionScreen from '@screens/FileSelectionScreen';
import FileTranscriptionScreen from '@screens/FileTranscriptionScreen';
import useAppStore, { APP_VIEWS } from '@store/useAppStore';

const App = () => {
  const { t } = useTranslation();
  const currentView = useAppStore((state) => state.currentView);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-charcoal-50 mb-12 text-center text-5xl font-extrabold">
        {t('title')}
      </h1>

      {currentView === APP_VIEWS.SELECTION && <FileSelectionScreen />}
      {currentView === APP_VIEWS.TRANSCRIPTION && <FileTranscriptionScreen />}
    </div>
  );
};

export default App;
