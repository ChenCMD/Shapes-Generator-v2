import React from 'react';
import Button from 'react-bootstrap/esm/Button';
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
            <div className={styles['contents']}>
                <BtnMenu label={locale('menu.grid')}>
                    <div className={styles['button-group']}>
                        <Button disabled={gridMode === GridMode.off} onClick={() => setGridMode(GridMode.off)}>{locale('menu.grid.off')}</Button>
                        <Button disabled={gridMode === GridMode.block} onClick={() => setGridMode(GridMode.block)}>{locale('menu.grid.block')}</Button>
                        <Button disabled={gridMode === GridMode.double} onClick={() => setGridMode(GridMode.double)}>{locale('menu.grid.double')}</Button>
                    </div>
                </BtnMenu>
                <OptimizeParticleSetting {...{ duplicatedPointRange, setDuplicatedPointRange }} />
            </div>
        </div>
    );
};

export default React.memo(PreviewerMenu);
