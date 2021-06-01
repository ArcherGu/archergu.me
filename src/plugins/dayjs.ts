import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { PluginInstall } from '@/types';

export const install: PluginInstall = () => {
    dayjs.extend(LocalizedFormat);
};
