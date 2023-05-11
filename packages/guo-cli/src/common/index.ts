import fse from 'fs-extra'
import {join, sep} from 'path'
import { SRC_DIR, getGConfig } from "./constant"
import { InlineConfig, loadConfigFromFile, mergeConfig } from 'vite';

const {readdirSync, existsSync, readFileSync, outputFileSync, lstatSync} = fse


export const EXT_REGEXP = /\.\w+$/

export function replaceExt(path:string, ext: string) {
  return path.replace(EXT_REGEXP, ext)
}

export type ModuleEnv = 'esmodule' | 'commonjs'
export type NodeEnv = 'production' | 'development' | 'test'
export type BuildTarget = 'site' | 'package'

export function setModuleEnv(value: ModuleEnv) {
  process.env.BABEL_MODULE = value
}
export function setNodeEnv(val: NodeEnv) {
  process.env.NODE_ENV = val
}

export function setBuildTarget(value: BuildTarget) {
  process.env.BUILD_TARGET = value
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

/**
 * 去除内容中的重复部分,然后写入文件
 * 机制：每次写入前，先读取当前已经写入的内容，判断内容是否相同
 * @param filePath 
 * @param content 
 * @returns 
 */
export function smartOutputFile(filePath:string, content: string) {
  if(existsSync(filePath)) {
    const previousContent = readFileSync(filePath, 'utf-8')

    if(previousContent === content) {
      return
    }
  }

  outputFileSync(filePath, content)
}

export const SCRIPT_REGEXP = /\.(js|ts|jsx|tsx)$/
export const STYLE_REGEXP = /\.(css|less|scss)$/
export const ASSET_REGEXP =  /\.(png|jpe?g|gif|webp|ico|jfif|svg|woff2?|ttf)$/i;
export const JSX_REGEXP =  /\.(j|t)sx$/
export const DEMO_REGEXP = new RegExp('\\' + sep + 'demo$');
export const TEST_REGEXP = new RegExp('\\' + sep + 'test$');
export const SFC_REGEXP = /\.(vue)$/;


export const isDir = (dir: string) => lstatSync(dir).isDirectory()
export const isScript = (path: string) => SCRIPT_REGEXP.test(path)
export const isStyle = (path: string) => STYLE_REGEXP.test(path)
export const isAsset = (path: string) => ASSET_REGEXP.test(path)
export const isJsx = (path: string) => JSX_REGEXP.test(path);
export const isDemoDir = (dir: string) => DEMO_REGEXP.test(dir);
export const isTestDir = (dir: string) => TEST_REGEXP.test(dir);
export const isSfc = (path: string) => SFC_REGEXP.test(path);


export async function mergeCustomViteConfig(
  config: InlineConfig,
  mode: 'production' | 'development'
): Promise<InlineConfig> {
  const gConfig = getGConfig();
  const configureVite = gConfig.build?.configureVite;

  const userConfig = await loadConfigFromFile(
    {
      mode,
      command: mode === 'development' ? 'serve' : 'build',
    },
    undefined,
    process.cwd()
  );

  if (configureVite) {
    const ret = configureVite(config);
    if (ret) {
      config = ret;
    }
  }

  if (userConfig) {
    return mergeConfig(config, userConfig.config);
  }

  // console.log('config: \n', JSON.stringify(config))
  return config;
}


