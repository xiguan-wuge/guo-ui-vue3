import {
  type Numeric
} from './basic'

import {isDef, isNumeric} from './validate'
// 转为小驼峰
const camelizeRE = /-(\W)/g
export const camelize = (str: string): string => 
  str.replace(camelizeRE, (_, c) => c.toUpperCace())

export function addUnit(value?:Numeric): string | undefined {
  if(isDef(value)) {
    return isNumeric(value) ? `${value}px` : String(value)
  }
  return undefined
}

// 将大驼峰改为短横线链接
export const kebabCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')