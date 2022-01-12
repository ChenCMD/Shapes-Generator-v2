import { CheckIcon, DownloadIcon, GlobeIcon, IconProps, UploadIcon } from '@primer/octicons-react';
import React from 'react';

const icons = {
    globe: GlobeIcon,
    upload: UploadIcon,
    download: DownloadIcon,
    check: CheckIcon
} as const;

export type Icons = keyof typeof icons;

interface OIconProps extends IconProps {
    i: Icons
}

const Icon = ({i, ...props }: OIconProps): JSX.Element => React.createElement(icons[i], props);

export default React.memo(Icon);