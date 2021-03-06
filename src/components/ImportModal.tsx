import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ReactModal from 'react-modal';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { importShape } from '../ShapeNodes';
import styles from '../styles/ImportModal.module.scss';
import { StateDispatcher } from '../types/StateDispatcher';
import { stopPropagation } from '../utils/element';
import FileUploader from './FileUploader';
import { showNotification, useLocale } from './ShapesGenerator';

ReactModal.setAppElement('#root');

interface ImportModalProps {
    setImportModalOpened: StateDispatcher<boolean>
    isOpen: boolean
    shapesDispatch: ShapesDispatch
}

const ImportModal = ({ setImportModalOpened, isOpen, shapesDispatch }: ImportModalProps): JSX.Element => {
    const locale = useLocale();

    const [importKey, setImportKey] = useState<string>('');

    const onRequestClose = useCallback(() => setImportModalOpened(false), [setImportModalOpened]);

    const onImport = useCallback(() => {
        shapesDispatch({ type: 'addMany', shapes: importShape(importKey) });
        onRequestClose();
    }, [importKey, onRequestClose, shapesDispatch]);

    const onFileUpload = useCallback((files: FileList) => {
        files[0].text().then(text => {
            const key = text.match(/\[ImportKey\]: ([A-Za-z0-9+\-_$]*)\r?\n/);
            if (!key) {
                showNotification('error', locale('error.import-key-does-not-exists'));
                return;
            }
            shapesDispatch({ type: 'addMany', shapes: importShape(key[1]) });
            onRequestClose();
        });
    }, [locale, onRequestClose, shapesDispatch]);

    const onChangeKeyInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setImportKey(e.target.value.trim()), []);
    return (
        <ReactModal
            overlayClassName={{
                base: styles['overlay'],
                afterOpen: styles['after'],
                beforeClose: styles['before']
            }}
            className={{
                base: styles['content'],
                afterOpen: styles['after'],
                beforeClose: styles['before']
            }}
            {...{ isOpen, onRequestClose }}
        >
            <FileUploader accept=".mcfunction" onFileUpload={onFileUpload}>{openDialog => (
                <Container fluid className={styles['container']}>
                    <Row noGutters>
                        <Col className={styles['col']}>
                            <div className={styles['text']}>{locale('import.import-key')}</div>
                            <input className={styles['input']} onChange={onChangeKeyInput} value={importKey} onKeyDown={stopPropagation} />
                        </Col>
                    </Row>
                    <Row><Col><hr className={styles['line']} /></Col></Row>
                    <Row noGutters>
                        <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Button onClick={onRequestClose}>{locale('cancel')}</Button>
                        </Col>
                        <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Button onClick={importKey === '' ? openDialog : onImport}>
                                {locale(importKey === '' ? 'import.from-mcfunction' : 'import.from-key')}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            )}</FileUploader>
        </ReactModal >
    );
};

export default React.memo(ImportModal);
