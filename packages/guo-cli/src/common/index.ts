import fse from 'fs-extra'
import {join} from 'path'
import { SRC_DIR } from "./constant"

const {readdirSync, existsSync, readFileSync, outputFileSync} = fse


export const EXT_REGEXP = /\.\w+$/

export function replaceExt(path:string, ext: string) {
  return path.replace(EXT_REGEXP, ext)
}

export type NodeEnv = 'production' | 'development' | 'test'
export function setNodeEnv(val: NodeEnv) {
  process.env.NODE_ENV = val
}

export const ENTRY_EXT = ['js', 'ts', 'tsx', 'jsx', 'vue']

export function hasDefaultExport(code: string) {
  return code.includes('export default') || code.includes('export { default }')
}

/**
 * 通过文件读取，获取组件名，
 * 核心：读取index.ts文件，判断内部是否有 export default 导出来判断是否是组件
 * @returns 
 */
export function getComponents() {
  const EXCLUDES = ['.DS_STore']
  const dirs = readdirSync(SRC_DIR)
  // console.log('dirs', dirs);
  

  return dirs
    .filter((dir:string) => !EXCLUDES.includes(dir))
    .filter((dir:string) => {
      return ENTRY_EXT.some(ext => {
        const path = join(SRC_DIR, dir, `index.${ext}`)
        if(existsSync(path)) {
          return hasDefaultExport(readFileSync(path, 'utf-8'))
        }
        return false
      })
    })
}

const camelizeRE = /-(\w)/g
const pascalizeRE = /(\w)(\w*)/g

export function camelize(str:string):string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase())
}

export function pascalize(str:string):string {
  return camelize(str).replace(
    pascalizeRE,
    (_, c1, c2) => c1.toUpperCase() + c2
  )
}

export function normalizePath(path: string):string {
  return path.replace(/\\/g, '/')
}

export function smartOutputFile(filePath:string, content: string) {
  if(existsSync(filePath)) {
    const previousContent = readFileSync(filePath, 'utf-8')

    if(previousContent === content) {
      return
    }
  }

  outputFileSync(filePath, content)
}


