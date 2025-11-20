import { useTranslation } from 'react-i18next';

const App = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-charcoal-50 mb-12 text-center text-5xl font-extrabold">
        {t('title')}
      </h1>
    </div>
  );
};

export default App;
