import {  withInstall } from "../utils";
import _Icon from './Icon'
import './index.less'

export const Icon = withInstall(_Icon)
export default Icon
export {iconProps} from './Icon'
export type {IconProps} from './Icon'

declare module 'vue' {
  export interface GlobalComponents {
    GIcon: typeof Icon
  }
}