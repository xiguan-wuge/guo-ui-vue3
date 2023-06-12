import {
  defineComponent,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import {
  createNamespace,
  extend,
  makeStringProp,
  numericProp,
} from '../utils'

// Types
import {
} from './types'
const [name, bem] = createNamespace('<%= name %>')

// CSS
import './index.less';

export const <%= name %>Props = extend({}, {

})

export type <%= componentName %>Props = ExtractPropTypes<typeof <%= name %>Props>; 

export default defineComponent({
  name,
  props: <%= name %>Props,
  setup(props, {emit, slots}) {

    return () => {
      
      const tagName = props.tag
      
      return (
        <tagName
        >
          <div class={bem('content')}>
          </div>
        </tagName>
      )
    }
    
  }
})