import {
  type Numeric,
  inBrowser
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

export function padZero(num: number, targetLength = 2): string {
  let str = num + ''
  while(str.length < targetLength) {
    str = '0' + str
  }
  return str
}

export function unitToPx(value: Numeric):number {
  if(typeof value === 'number') {
    return value
  }

  if(inBrowser) {
    if(value.includes('rem')){
      return convertRem(value)
    }
    if(value.includes('vw')) {
      return convertVw(value)
    }
    if(value.includes('vh')) {
      return convertVh(value)
    }
  }

  return parseFloat(value)
}