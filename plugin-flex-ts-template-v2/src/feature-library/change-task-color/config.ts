import { getFeatureFlags } from '../../utils/configuration';
import ChangeTaskColorConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.change_task_color as ChangeTaskColorConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
