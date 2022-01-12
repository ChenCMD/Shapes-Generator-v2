import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import styles from '../styles/PreviewerMenu.module.scss';
import { GridMode } from '../types/GridMode';
import { StateDispatcher } from '../types/StateDispatcher';
import BtnMenu from './BtnMenu';
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

    return (
        <div className={styles['window']}>
            <Container fluid className={styles['contents']}>
                <Row noGutters>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                        <BtnMenu label={locale('menu.grid')}>
                            <div className={styles['button-group']}>
                                <Button disabled={gridMode === GridMode.off} onClick={() => setGridMode(GridMode.off)}>{locale('menu.grid.off')}</Button>
                                <Button disabled={gridMode === GridMode.block} onClick={() => setGridMode(GridMode.block)}>{locale('menu.grid.block')}</Button>
                                <Button disabled={gridMode === GridMode.double} onClick={() => setGridMode(GridMode.double)}>{locale('menu.grid.double')}</Button>
                            </div>
                        </BtnMenu>
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                        <OptimizeParticleSetting {...{ duplicatedPointRange, setDuplicatedPointRange }} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(PreviewerMenu);
