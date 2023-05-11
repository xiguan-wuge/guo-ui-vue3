import { createRequire } from 'module'
import { join } from 'path'
import { existsSync } from 'fs'
import { normalizePath, smartOutputFile } from 'src/common'


import { SRC_DIR, STYLE_DEPS_JSON_FILE } from "src/common/constant"
import { CSS_LANG, getCssBaseFile } from 'src/common/css'

type Options = {
  outputPath?: string
  pathResolver?: (path: string) => string
}

/**
 * 将各组件中的如入口样式，添加到组件库整体入口文件中，如lib/index.less
 * @param options 
 * @returns 
 */
export function genPackageStyle(options: Options = {}) {
  // 创建require 代替 import
  const require = createRequire(import.meta.url)
  const styleDepsJson = require(STYLE_DEPS_JSON_FILE)
  // console.log('styleDepsJson', styleDepsJson.sequence);
  
  const ext = '.' + CSS_LANG

  let content = ''

  let baseFile = getCssBaseFile()
  // console.log('baseFile', baseFile);
  
  // 引入组件库baseCss
  if(baseFile) {
    if(options.pathResolver) {
      baseFile = options.pathResolver(baseFile)
    }

    content = `@import "${normalizePath(baseFile)}";\n`
  }
  // console.log('content', content);
  
  // 将各组建的样式文件，添加到整体入口样式文件中
  content += styleDepsJson.sequence
    .map((name: string) => {
      let path = join(SRC_DIR, `${name}/index${ext}`)

      if(!existsSync(path)) return ''

      if(options.pathResolver) {
        path = options.pathResolver(path)
      }

      return `@import "${normalizePath(path)}";`
    })
    .filter((item: string) => !!item)
    .join('\n')

  if(options.outputPath) {
    smartOutputFile(options.outputPath, content)
  } else {
    return content
  }
}