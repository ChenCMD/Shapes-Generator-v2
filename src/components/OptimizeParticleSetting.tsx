import React, { useCallback } from 'react';
import { useLocale } from './ShapesGenerator';
import { StateDispatcher } from '../types/StateDispatcher';
import BtnToggle from './BtnToggle';

interface OptimizedParticleSettingProps {
    duplicatedPointRange: number,
    setDuplicatedPointRange: StateDispatcher<number>
}

const OptimizedParticleSetting = ({ duplicatedPointRange, setDuplicatedPointRange }: OptimizedParticleSettingProps): JSX.Element => {
    const locale = useLocale();
    const onClick = useCallback(() => setDuplicatedPointRange(prev => prev === 0.1 ? 0 : 0.1), [setDuplicatedPointRange]);
    return (
        <BtnToggle value={duplicatedPointRange === 0.1} onClick={onClick} label={locale('delete-duplicate-points')} />
    );
};

export default React.memo(OptimizedParticleSetting);