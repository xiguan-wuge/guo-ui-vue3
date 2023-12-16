import {
  computed,
  defineComponent,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import {
  isDef,
  addUnit,
  createNamespace,
  numericProp,
  makeStringProp,
  truthProp,
  type Numeric,
  isNumeric
} from '../utils'

const [name, bem] = createNamespace('badge')
export type BadgePosition = 
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

// 这个是针对vue3的props， 和ts的类型声明要分开
export const badgeProps = {
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  color: String,
  offset: Array as unknown as PropType<[Numeric, Numeric]>,
  content: numericProp,
  showSize: numericProp,
  showZero: truthProp,
  position: makeStringProp<BadgePosition>('top-right')
}

export type BadgeProps = ExtractPropTypes<typeof badgeProps>

export default defineComponent({
  name,
  props: badgeProps,
  setup(props, {slots}) {

    const hasContent = () => {
      if(slots.content) {
        return true
      }
      const {content, showZero} = props
      return (
        isDef(content) &&
        content !== '' &&
        (showZero || (content !== 0 && content !== '0'))
      )
    }

    const renderContent = () => {
      const {dot, max, content} = props

      if(!dot && hasContent()) {
        if(slots.content) {
          return slots.content()
        }

        // 这个判断语句没理解透
        if(isDef(max) && isNumeric(content!) && +content > max) {
          return `${max}+`
        }
        return content
      }
    }

    const style = computed(() => {
      const style: CSSProperties = {
        background: props.color
      }
      if(props.offset) {
        const [x, y] = props.offset
        if(slots.default) {
          style.top = addUnit(y)

          if(typeof x === 'number') {
            style.right = addUnit(-x)
          } else {
            style.right = x.startsWith('-') ? x.replace('-', '') : `-${x}`
          }
        } else {
          style.marginTop = addUnit(y)
          style.marginLeft = addUnit(x)
        }
      }
      return style
    })
    // 实际的渲染badge
    const renderBadge = () => {
      if(hasContent() || props.dot) {
        return (
          <div
            class={bem([
              props.position,
              {dot: props.dot, fixed: !!slots.default}
            ])}
            style={style.value}
          >
            {renderContent()}
          </div>
        )
      }
    }
    return () => {
      if(slots.default) {
        const {tag} = props
        return (
          <tag class={bem('wrapper')}>
            {slots.default()}
            {renderBadge()}
          </tag>
        )
      }

      return renderBadge()
    }
  } 
})