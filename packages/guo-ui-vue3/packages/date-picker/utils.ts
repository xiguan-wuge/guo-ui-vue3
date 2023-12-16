import {
  extend,
  padZero,
  makeArrayProp
} from '../utils'

import type {PickerOption} from '../picker'

type Filter = (columnType: string, options: PickerOption[]) => PickerOption[]
type Formatter = (type: string, option: PickerOption) => PickerOption
export const genOptions = <T extends string>(
  min: number,
  max: number,
  type: TemplateStringsArray,
  formatter: FormDataEntryValue,
  filter: Filter
) => {
  const options = times(max-min + 1, (index:number) => {
    const value = padZero(min + index)
    return formatter(type, {
      text: value,
      value
    })
  })
  return filter ? filter(type, options) : options
}

  
export const getMonthEndDay = (year: number, month: number):number => 
  32 - new Date(year, month-1, 32).getDate()

export const shareProps = extend({}, pickerShareProps, {
  modelValue: makeArrayProp<string>(),
  filter: Function as PropType<Filter>,
  formatter: {
    type: Function as PropType<Formatter>,
    default: (type: string, option: PickerOption) => option
  }

})