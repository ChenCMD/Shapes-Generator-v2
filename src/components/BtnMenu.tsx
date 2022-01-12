import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import useFocus from '../hooks/useFocus';
import Icon, { Icons } from './Icon';

interface BtnMenuProps extends JSX.IntrinsicClassAttributes<HTMLDivElement> {
    icon?: Icons
    iconSize?: number
    label?: string
    tooltip?: string
    children: JSX.Element | JSX.Element[]
}

const BtnMenu = ({ icon, iconSize, label, tooltip, children, ...props }: BtnMenuProps): JSX.Element => {
    const [active, setActive] = useFocus();

    return (
        <div {...props}>
            <Button aria-label={tooltip} onClick={setActive} >
                {icon && <Icon i={icon} size={iconSize}/>} {label}
            </Button>
            {active && children}
        </div>
    );
};

export default React.memo(BtnMenu);