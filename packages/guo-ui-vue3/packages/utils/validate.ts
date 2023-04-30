import { type Numeric } from "./basic"

export const isDef = <T>(val: T): val is NonNullable<T> => 
  val !== undefined && val !== null

export const isNumeric = (val: Numeric): val is string => 
  typeof val === 'number' || /^\d+(\.d+)?$/.test(val)
