import type {PropType} from 'vue'
export const extend = Object.assign

export type Numeric = number | string

export const inBrowser = typeof window !== 'undefined'

export const makeArrayProp = <T>() => ({
  type: Array as PropType<T[]>,
  default: () => []
})

export const isDate = (val: unknown): val is Date =>
  Object.prototype.toString.call(val) === '[object Date]' &&
    !Number.isNaN((val as Date).getTime())