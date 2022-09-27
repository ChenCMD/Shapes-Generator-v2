import { useContext } from 'react';
import { resolveLocaleUsing, locales } from '../locales';
import { LanguageContext } from './Language';

export const useLocale = (): {
  resolveLocale: ReturnType<typeof resolveLocaleUsing>;
} => {
  const language = useContext(LanguageContext);

  return {
    resolveLocale: resolveLocaleUsing(locales[language])
  };
};
