import {join, isAbsolute} from 'path'
import {existsSync} from 'fs'
import { SRC_DIR, getGConfig } from "./constant";
import {STYLE_DIR} from './constant.js'

type CSS_LANG = 'css' | 'less' | 'scss'
function getCssLang(): CSS_LANG {
  return 'less'
}
export const CSS_LANG = getCssLang();

export function getCssBaseFile() {
  const gConfig =  getGConfig()
  let path = join(STYLE_DIR, `base.${CSS_LANG}`)

  const baseFile = gConfig.build?.css?.base || ''

  if(baseFile) {
    path = isAbsolute(baseFile) ? baseFile : join(SRC_DIR, baseFile)
  }

  if(existsSync(path)) {
    return path
  }

  return null
}