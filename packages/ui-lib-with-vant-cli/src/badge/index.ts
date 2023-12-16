import {withInstall} from '../utils'
import _Badge from './Badge'
import './index.less'

export const Badge = withInstall(_Badge)
export default Badge
export {badgeProps} from './Badge'
export type {BadgeProps, BadgePosition} from './Badge'
export type {BadgeThemeVars} from './types'

declare module 'vue' {
  export interface GloabalComponents {
    GBadge: typeof Badge
  }
}