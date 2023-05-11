import fse from 'fs-extra'
import {parse} from 'path'
import { getGConfig, replaceExt } from "../common/constant"
import { compileCss } from './compile-css.js'
import { compileLess } from './compile-less.js'
import { compileSass } from './compile-sass.js'

const { removeSync, readFileSync, writeFileSync } = fse


async function compileFile(filePath:string) {
  const parsedPath = parse(filePath)

  try {
    if(parsedPath.ext === '.less') {
      const source = await compileLess(filePath)
      // console.log('source', source);
      return await compileCss(source)
    }

    if(parsedPath.ext === '.scss') {
      const source = await compileSass(filePath)
      return await compileCss(source)
    }

    const source = readFileSync(filePath, 'utf-8')
    return await compileCss(source)
  } catch (err) {
    console.error('Compile style failed: ' + filePath)
    console.log('err:  ', err);
    
    throw err
  }
}



export async function compileStyle(filePath: string) {
  const css = await compileFile(filePath)
  const gConfig = getGConfig()

  if(gConfig.build?.css.removeSoureFile) {
    removeSync(filePath)
  }

  writeFileSync(replaceExt(filePath, '.css'), css)
}