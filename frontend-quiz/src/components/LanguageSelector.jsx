import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supportedLanguages } from '../locales/translations';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
        {t('language')}:
      </label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="px-3 py-1 border border-beige rounded-lg text-sm focus:outline-none focus:ring-buff focus:border-buff bg-white"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
