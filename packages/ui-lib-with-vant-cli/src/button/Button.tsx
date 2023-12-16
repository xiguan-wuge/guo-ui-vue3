import {
  defineComponent,
  // type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import {
  createNamespace,
  extend,
  makeStringProp,
  numericProp,
  preventDefault,
  BORDER_SURROUND
} from '../utils'

// Types
import {
  ButtonType,
  ButtonNativeType,
  ButtonSize
} from './types'
const [name, bem] = createNamespace('button')

// CSS
import './index.less';

export const buttonProps = extend({}, {
  // 按钮根节点的 HTML 标签
  tag: makeStringProp<keyof HTMLElementTagNameMap>('button'), // <> 类型推断，keyof 是属于
  text: String, // 和tag 类型定义的区别是什么？ 标签名？
  icon: String, // 设置按钮图标
  type: makeStringProp<ButtonType>('default'), // 按钮形状 圆形或者方形
  size: makeStringProp<ButtonSize>('normal'),
  color: String, // 自定义按钮颜色
  block: Boolean, // 设置为块级元素
  plain: Boolean, // 是否为朴素按钮	
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  // 原生 button 标签的 type 属性
  nativeType: makeStringProp<ButtonNativeType>('button'),
  loadingSize: numericProp,
  loadingText: String,
  // loadingType: String as PropType<LoadingType>,
  // iconPosition: makeStringProp<ButtonIconPosition>('left'),

})

// 向外导出ButtonProps的类型声明 
export type ButtonProps = ExtractPropTypes<typeof buttonProps>; 

export default defineComponent({
  name,
  props: buttonProps,
  emits: ['click'], // 先注册需要向外emit的事件，以便在setup中向外emit事件
  setup(props, {emit, slots}) {

    const renderText = () => {
      let text;
      if(props.loading) {
        text = props.loadingText
      } else {
        // 若存在default插槽就使用插槽内容，否则使用text
        text = slots.default ? slots.default() : props.text
      }
      if(text) {
        return <span class={bem('text')}>{text}</span>
      }
    }

    const onClick = (event: MouseEvent) => {
      if(props.loading) {
        preventDefault(event)
      } else if(!props.disabled) {
        emit('click', event)
      }
    }

    const getStyle = () => {
      const {color, plain} = props
      if(color) {
        const style:CSSProperties = {
          color: plain ? color : 'white'
        }

        if(!plain) {
          // 通过background 实现渐变,
          style.background = color
        }
        // 背景渐变时，隐藏border
        if(color.includes('gradient')) {
          style.border = 0
        } else {
          style.borderColor = color
        }

        return style
      }
    }
    return () => {
      const {
        // tag as tagName,
        type,
        size,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        hairline,
        nativeType,
        // iconPosition,
      } = props

      const classes = [
        bem([
          type,
          size,
          {
            plain,
            block,
            round,
            square,
            loading,
            disabled,
            hairline
          }
        ]),
        { [BORDER_SURROUND]: hairline }
      ]
      const tagName = props.tag
      
      return (
        <tagName
          type={nativeType}
          class={classes}
          style={getStyle()}
          disabled={disabled}
          onClick={onClick}
        >
          <div class={bem('content')}>
            {renderText()}
          </div>
        </tagName>
      )
    }
    
  }
})