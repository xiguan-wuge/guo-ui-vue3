import {
  inject,
  computed,
  defineComponent,
  type PropType,
  type ExtractPropTypes
} from 'vue'
import {
  addUnit,
  numericProp,
  makeStringProp,
  createNamespace
} from '../utils'
import {Badge, type BadgeProps} from '../badge'
const [name, bem] = createNamespace('icon')

export const iconProps = {
  dot: Boolean,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('i'),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String, 
  badgeProps: Object as PropType<Partial<BadgeProps>>, // Partial?
  classPrefix:String
}

export type IconProps = ExtractPropTypes<typeof iconProps>

const isImage = (name?: string) => name?.includes('/')
export default defineComponent({
  name,

  props: iconProps,

  setup(props, {slots}) {

    // 涉及configProvider的代码，先注释，后期补上
    // const config = inject(CONFIG_PROVIDER_KEY, null)
    const classPrefix = computed(
      () => props.classPrefix || bem()
    )
    return () => {
      const {tag, dot, name, size, badge, color} = props
      const isImageIcon = isImage(name)
      return (
        <Badge
          dot={dot}
          tag={tag}
          class={[
            classPrefix.value,
            isImageIcon ? '' : `${classPrefix.value}-${name}`
          ]}
          style={{
            color,
            fontSize: addUnit(size)
          }}
          content={badge}
          {...props.badgeProps}
        >
          {slots.default?.()}
          {isImageIcon && <img class={bem('image')} src={name}/>}
        </Badge>
      )
    }
    
  }
})