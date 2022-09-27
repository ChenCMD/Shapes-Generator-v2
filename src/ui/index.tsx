import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles/global.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import {
  chooseFirstRecognizedLanguage,
  LanguageSpecification
} from './locales/Language';
import { LanguageContext } from './contexts/Language';

const urlParams = window.location.search
  .substring(1)
  .split('&')
  .reduce<Record<string, string>>((obj, param) => {
    const [key, val] = param.split('=');
    obj[key] = val;
    return obj;
  }, {});

if (urlParams.theme) {
  document.documentElement.setAttribute('theme', urlParams.theme);
}

// 言語設定の候補を集める
const configuredLanguageCandidates: string[] = [];
urlParams['lang'] !== undefined &&
  configuredLanguageCandidates.push(urlParams['lang']);
navigator.languages !== undefined &&
  configuredLanguageCandidates.push(...navigator.languages);
configuredLanguageCandidates.push(navigator.language);

const initialLanguage: LanguageSpecification =
  chooseFirstRecognizedLanguage(configuredLanguageCandidates) ?? 'en';

const RootComponent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [language, setLanguage] = useState(initialLanguage);

  return (
    <>
      <React.StrictMode>
        <LanguageContext.Provider value={language}></LanguageContext.Provider>
      </React.StrictMode>
    </>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));
