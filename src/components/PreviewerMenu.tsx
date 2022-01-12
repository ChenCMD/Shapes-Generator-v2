import React, { useCallback } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import styles from '../styles/PreviewerMenu.module.scss';
import { GridMode } from '../types/GridMode';
import { StateDispatcher } from '../types/StateDispatcher';
import OptimizeParticleSetting from './OptimizeParticleSetting';
import { useLocale } from './ShapesGenerator';

interface PreviewerMenuProps {
    gridMode: GridMode
    setGridMode: StateDispatcher<GridMode>
    duplicatedPointRange: number
    setDuplicatedPointRange: StateDispatcher<number>
}

const PreviewerMenu = ({ gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange }: PreviewerMenuProps): JSX.Element => {
    const locale = useLocale();
    const onGridModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGridMode(parseInt(e.target.value)), [setGridMode]);

    return (
        <div className={styles['window']}>
            <Container fluid>
                <Row>
                    <Col>
                        <div className={styles['text']}>{locale('menu.grid')}</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={gridMode} value={gridMode}>
                            <ToggleButton className={styles['button']} value={0} onChange={onGridModeChange}>
                                {locale('menu.grid.off')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={1} onChange={onGridModeChange}>
                                {locale('menu.grid.block')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={2} onChange={onGridModeChange}>
                                {locale('menu.grid.double')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                    <Col>
                        <OptimizeParticleSetting {...{ duplicatedPointRange, setDuplicatedPointRange }} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(PreviewerMenu);
