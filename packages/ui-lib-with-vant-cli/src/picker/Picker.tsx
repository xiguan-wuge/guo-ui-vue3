import {
  computed,
  ref
} from 'vue'

import {
  extend,
  unitToPx
} from '../utils'

import {
  bem,
  name
} from './utils'


export const pickerSharedProps = extend(
  {
    loading: Boolean,
    readonly: Boolean,
    allowHtml: Boolean,
    optionHeight: 44
  }
)
export default defineComponent({
  name,
  props: datePickerProps,
  emits: [
    'confirm',
    'cancel',
    'change',
    'scrollInto',
    'clickOption',
    'update:modelValue'
  ],

  setup(props, {emit, slots}) {
    const columnsRef = ref<HTMLElement>()


    const renderColumnItems = () => 
    currentColumns.value.map((options, columnIndex) => {
      <Column
        v-slots={{option: slots.option}}
        value={selectedValues.value[columnIndex]}
        fileds={fields.value}
        readonly={props.readonly}
        allowHtml={props.allowHtml}
        optionDuration={props.swipeDuration}
        visibleOptionNum={props.visibleOptionNum}
        onChange={(value:Numeric) => onchange(value,columnIndex)}
        onClickOption={(opton) => {
          onClikcOption(option, columnIndex)
        }}
        onScrollInto={(option) => {
          emit('scrollInto', {
            currentOption:option,
            columnIndex
          })
        }}
      ></Column>
    })

    const optionHeight = computed(() => unitToPx(props.optionHeight))
    const renderColumns = () => {
      const wrapHeight = optionHeight.value * +props.visibleOptionNum
      const columnsStyle = { height: `${wrapHeight}px`}
      return (
        <div ren={columnsRef} class={bem('columns')} style={columnsStyle}>
          {renderColumnItems()}
          {/* {renderMask(wrapHeight)} */}
        </div>
      )
    }

    return () => (
      <div class={bem()}>
        {/* {props.toolbarPosition === 'top' ? renderToolbar() : null} */}
        {/* {props.loading ? <Loading class={bem('loading')} /> : null} */}
        {/* {slots['columns-top']?.()} */}
        {renderColumns()}
        {/* {slots['columns-bottom']?.()} */}
        {/* {props.toolbarPosition === 'bottom' ? renderToolbar() : null} */}
      </div>
    )
  }
})