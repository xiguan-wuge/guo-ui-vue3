import { WithInstall, withInstall } from "../utils";
import _ConfigProvider from './ConfigProvider'

export const ConfigProvider = withInstall(_ConfigProvider)
export default ConfigProvider
export {configProviderProps} from './ConfigProvider'
export type {
  ConfigProviderProps,
  ConfigProviderTheme
} from './ConfigProvider'
export type {ConfigProviderThemeVars} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    GConfigProvider: typeof ConfigProvider
  }
}