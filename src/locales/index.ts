import { isValidateLanguage, SpecificatedLanguage } from '../types/Language';
import { camelCaseToSnakeCase } from '../utils/common';
import enLocale from './en.json';

const locales: Partial<Record<SpecificatedLanguage, Record<string, string>>> = {
  en: enLocale,
};
let language: SpecificatedLanguage = 'en';

export const languageMap: Readonly<Record<SpecificatedLanguage, string>> = {
  en: 'English',
  ja: '日本語',
} as const;

export function getLanguage(): SpecificatedLanguage {
  return language;
}

async function loadLocale(lang: SpecificatedLanguage): Promise<void> {
  const data: Record<string, string> = await import(`./${lang}.json`);
  if (!data) {
    return;
  }
  locales[lang] = data;
}

// TODO ここに限った話ではないがどうにかする
export async function setupLanguage(
  langs: string[],
  ignoreError = false,
  showNotification: (type: string, text: string) => void = (t, s) => {}
): Promise<string> {
  for (const [i, targetLanguage] of langs.entries()) {
    if (targetLanguage === language) {
      break;
    }
    if (isValidateLanguage(targetLanguage)) {
      if (locales[targetLanguage] === undefined) {
        await loadLocale(targetLanguage);
      }
      language = targetLanguage;
      break;
    } else {
      if (ignoreError || i !== 0) {
        continue;
      }
      showNotification('error', locale('error.invalid-language'));
    }
  }
  return language;
}

export function locale<P extends { toString(): string }>(
  key: string,
  ...params: P[]
): string {
  const snakedKey = camelCaseToSnakeCase(key);
  const value: string | undefined =
    locales[language]?.[snakedKey] ?? locales['ja']?.[snakedKey];
  return (
    resolveLocalePlaceholders(value, params) ??
    (console.warn(`Unknown locale key "${snakedKey}"`), 'missing locale')
  );
}

function resolveLocalePlaceholders<P extends { toString(): string }>(
  val: string | undefined,
  params?: P[]
): string | undefined {
  return val?.replace(/%\d+%/g, (match) => {
    const index = parseInt(match.slice(1, -1));
    return params?.[index] !== undefined ? params[index].toString() : match;
  });
}
