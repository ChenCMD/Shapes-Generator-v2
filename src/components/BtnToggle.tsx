import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Icon from './Icon';
import styles from '../styles/BtnToggle.module.scss';

interface BtnToggleProps extends JSX.IntrinsicClassAttributes<HTMLDivElement> {
    value: boolean
    onClick: () => void
    label?: string
    tooltip?: string
}

const BtnToggle = ({ value, onClick, label, tooltip, ...props }: BtnToggleProps): JSX.Element => (
    <div {...props}>
        <Button aria-label={tooltip} onClick={onClick} >
            <Icon i="check" size={22} className={value ? '' : styles['hidden']} /> {label}
        </Button>
    </div>
);

export default React.memo(BtnToggle);