import {withInstall} from '../utils'
import _ButtonGroup from './ButtonGroup'
// import './index.less'

export const ButtonGroup = withInstall(_ButtonGroup)
export default ButtonGroup
// export {buttonProps} from './ButtonGroup'
// export type {ButtonProps} from './Button'
// export type {
//   ButtonType,
//   ButtonSize,
//   ButtonThemeVars,
//   ButtonNativeType,
//   ButtonIconPosition,
// } from './types'

declare module 'vue' {
  // 接口可以重载
  export interface GlobalComponents {
    GButtonGroup: typeof ButtonGroup
  }
}