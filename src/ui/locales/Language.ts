export const specifiableLanguages = ['en', 'ja'] as const;
export type LanguageSpecification = typeof specifiableLanguages[number];

export function isLanguageSpecification(
  str: string
): str is LanguageSpecification {
  switch (str) {
    case 'en':
    case 'ja':
      return true;
    default:
      return false;
  }
}

export function chooseFirstRecognizedLanguage(
  languageCandidates: string[]
): LanguageSpecification | undefined {
  for (const languageCandidate of languageCandidates) {
    if (isLanguageSpecification(languageCandidate)) {
      return languageCandidate;
    }
  }
}
