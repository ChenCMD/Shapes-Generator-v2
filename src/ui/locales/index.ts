import { LanguageSpecification } from './Language';
import * as enLocale from './en.json';
import * as jaLocale from './ja.json';

type Locale = typeof enLocale & typeof jaLocale;
type LocaleKey = keyof Locale;

export const locales: Record<LanguageSpecification, Locale> = {
  ja: jaLocale,
  en: enLocale
};

export const languageMap = {
  en: 'English',
  ja: '日本語'
} as const;

export const resolveLocaleUsing =
  (locale: Locale) =>
  <P extends { toString(): string }>(key: LocaleKey, ...params: P[]): string =>
    resolveLocalePlaceholders(locale[key], params);

function resolveLocalePlaceholders<P extends { toString(): string }>(
  val: string,
  params?: P[]
): string {
  return val.replace(/%\d+%/g, (match) => {
    const index = parseInt(match.slice(1, -1));
    return params?.[index] !== undefined ? params[index].toString() : match;
  });
}
