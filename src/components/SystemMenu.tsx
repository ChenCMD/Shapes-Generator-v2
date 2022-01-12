import React, { useCallback, useMemo } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import { languageMap } from '../locales';
import styles from '../styles/SystemMenu.module.scss';
import { isValidateLanguage, SpecificatedLanguage } from '../types/Language';
import { StateDispatcher } from '../types/StateDispatcher';
import { objEntries } from '../utils/common';
import BtnMenu from './BtnMenu';
import Icon from './Icon';
import { useLocale } from './ShapesGenerator';

interface SystemMenuProps {
    language: SpecificatedLanguage
    setLanguage: StateDispatcher<string>
    openImportModal: StateDispatcher<boolean>
    openExportModal: StateDispatcher<boolean>
}

const SystemMenu = ({ language, setLanguage, openImportModal, openExportModal }: SystemMenuProps): JSX.Element => {
    const locale = useLocale();
    const onImport = useCallback(() => openImportModal(true), [openImportModal]);
    const onExport = useCallback(() => openExportModal(true), [openExportModal]);
    const onLanguageChange = useCallback((lang: string) => isValidateLanguage(lang) && setLanguage(lang), [setLanguage]);

    const languageButtons = useMemo(
        () => (
            <div className={styles['button-group']}>{
                objEntries(languageMap).map(([code, name]) => (
                    <Button key={code} onClick={() => onLanguageChange(code)} disabled={code === language}>{name}</Button>
                ))
            }</div>
        ),
        [language, onLanguageChange]
    );

    return (
        <div className={styles['window']}>
            <div className={styles['contents']}>
                <Col><BtnMenu icon="globe" iconSize={24} label={locale('menu.language')}>{languageButtons}</BtnMenu></Col>
                <Col><Button onClick={onImport}><Icon i="upload" size={24} />{locale('menu.import')}</Button></Col>
                <Col><Button onClick={onExport}><Icon i="download" size={24} />{locale('menu.export')}</Button></Col>
            </div>
        </div>
    );
};

export default React.memo(SystemMenu);
