import React, { useCallback } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
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
    const onLanguageChange = useCallback(
        ({ target: { value } }: React.MouseEvent<HTMLElement>) => isValidateLanguage(value) && setLanguage(value),
        [setLanguage]
    );

    return (
        <div className={styles['window']}>
            <Container fluid><Row noGutters>
                <Col>
                    <div className={styles['nav']}>
                        <BtnMenu icon="globe" label={locale('menu.language')}>{
                            objEntries(languageMap).map(([code, name]) => (
                                <Button key={code} value={code} onClick={onLanguageChange}>{name}</Button>
                            ))
                        }</BtnMenu>
                    </div>
                </Col>
                <Col><Button onClick={onImport}><Icon i="download" size={24} /> {locale('menu.import')}</Button></Col>
                <Col><Button onClick={onExport}><Icon i="upload" size={24} /> {locale('menu.export')}</Button></Col>
            </Row></Container>
        </div>
    );
};

export default React.memo(SystemMenu);
