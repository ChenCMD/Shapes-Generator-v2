import { Dispatch, useState } from 'react';
import { resolveLocaleUsing, locales } from '../locales';
import { LanguageSpecification } from '../locales/Language';

export const useLocale = (): {
  resolveLocale: ReturnType<typeof resolveLocaleUsing>;
  language: LanguageSpecification;
  setLanguage: Dispatch<LanguageSpecification>;
} => {
  const [language, setLanguage] = useState<LanguageSpecification>('en');

  return {
    resolveLocale: resolveLocaleUsing(locales[language]),
    language,
    setLanguage
  };
};
