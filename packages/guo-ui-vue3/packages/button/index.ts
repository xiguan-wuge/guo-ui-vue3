import {withInstall} from '../utils'
import _Button from './Button'
import './index.less'

export const Button = withInstall(_Button)
export default Button
export {buttonProps} from './Button'
export type {ButtonProps} from './Button'
export type {
  ButtonType,
  ButtonSize,
  ButtonThemeVars,
  ButtonNativeType,
  ButtonIconPosition,
} from './types'

declare module 'vue' {
  // 接口可以重载
  export interface GlobalComponents {
    GButton: typeof Button
  }
}