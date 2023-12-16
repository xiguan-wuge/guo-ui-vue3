import type { PropType } from "vue"

// 定义 string类型的prop
export const makeStringProp = <T>(defaultVal: T) => ({ // <T> 泛型
  type: String as unknown as PropType<T>,
  default: defaultVal
})

export const numericProp = [Number, String] // 元祖

export const truthProp = {
  type: Boolean,
  default: true as const
}