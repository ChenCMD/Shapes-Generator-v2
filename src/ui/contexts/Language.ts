import { createContext } from 'react';
import { LanguageSpecification } from '../locales/Language';

export const LanguageContext = createContext<LanguageSpecification>('en');
