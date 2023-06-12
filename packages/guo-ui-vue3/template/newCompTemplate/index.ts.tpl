import { withInstall } from '../utils'
import _<%= componentName %> from './<%= componentName %>'
import './index.less'

export const <%= componentName %> = withInstall(_<%= componentName %>)
export default <%= componentName %>
export { <%= name %>Props } from './<%= componentName %>'
export type { <%= componentName %>Props } from './<%= componentName %>'
export type {
} from './types'

declare module 'vue' {
  // 接口可以重载
  export interface GlobalComponents {
    G<%= componentName %>: typeof <%= componentName %>
  }
}