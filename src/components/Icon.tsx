import { DownloadIcon, GlobeIcon, OcticonProps, UploadIcon } from '@primer/octicons-react';
import React from 'react';

const icons = {
    globe: GlobeIcon,
    upload: UploadIcon,
    download: DownloadIcon
} as const;

export type Icons = keyof typeof icons;

interface IconProps extends OcticonProps {
    i: Icons
}

const Icon = ({i, ...props }: IconProps): JSX.Element => React.createElement(icons[i], props);

export default React.memo(Icon);