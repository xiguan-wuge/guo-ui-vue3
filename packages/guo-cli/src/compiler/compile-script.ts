import esbuild, {type Format} from 'esbuild'
import {sep} from 'path'
import fse  from 'fs-extra'
import babel from '@babel/core'
import { getGConfig } from '../common/constant'
import {replaceCSSImportExt} from '../common/css.js'
import { replaceScriptImportExt } from './get-deps.js';
import {isJsx, replaceExt} from '../common/index.js'

const {readFileSync, removeSync, outputFileSync} = fse


export async function compileScript(
  filePath: string,
  format: Format
):Promise<void> {
  // ignore type declare file
  if(filePath.includes('.d.ts')) return

  const extensionMap = getGConfig().build?.extensions
  const extension = extensionMap?.[format] || '.js'
  // console.log('extension', extension);
  

  let code = readFileSync(filePath, 'utf-8')

  if(!filePath.includes(`${sep}style${sep}`)) {
    code = replaceCSSImportExt(code)
  }

  code = replaceScriptImportExt(code, filePath, extension)

  // 若是jsx 则采用babel transform 
  if(isJsx(filePath)) {
    // console.log('isJsx:  ', filePath);
    const babelResult = await babel.transformAsync(code, {
      filename: filePath,
      babelrc: false,
      presets: ['@babel/preset-typescript'],
      plugins: [
        [
          '@vue/babel-plugin-jsx',
          {
            enableObjectSlots: false
          }
        ]
      ]
    })
    // 进一步赋值code
    if(babelResult?.code) {
      ({code} = babelResult)
    }
  }

  const esbuildResult = await esbuild.transform(code, {
    loader: 'ts',
    target: 'es2016',
    format
  });

  ({ code } = esbuildResult)

  
  const jsFilePath = replaceExt(filePath, extension)
  console.log('jsFilePath', jsFilePath);
  
  removeSync(filePath)
  outputFileSync(jsFilePath, code)
}