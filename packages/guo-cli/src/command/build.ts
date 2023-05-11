import fse from 'fs-extra'
import {execa} from 'execa';
import {resolve, join, relative} from 'path'
import {clean} from './clean.js'
import { installDependencies } from '../common/manager.js';
import { genPackageEntry } from '../compiler/gen-package-entry.js';
import { genStyleDepsMap } from '../compiler/gen-style-deps-map.js';
import { genComponentStyle } from '../compiler/gen-component-style.js';
import { compileStyle } from '../compiler/compile-style.js';
import { compileScript } from '../compiler/compile-script.js';
import { compileSfc } from '../compiler/compile-sfc.js';
import { compileBundles } from '../compiler/compile-bundles.js';


import {
  setNodeEnv,
  setBuildTarget,
  setModuleEnv,
  isDir,
  isScript,
  isStyle,
  isAsset,
  isDemoDir,
  isTestDir,
  isSfc
} from '../common/index.js'
import {
  SRC_DIR,
  ES_DIR,
  LIB_DIR
} from '../common/constant.js'
import type { Format } from 'esbuild';
import { CSS_LANG } from '../common/css.js';
import { genPackageStyle } from '../compiler/gen-package-style.js';


const {remove, copy, readdir, existsSync} = fse

// const SRC_DIR = resolve('../guo-ui-vue3/packages')
// const ES_DIR = resolve('../guo-ui-vue3/es')
// const LIB_DIR = resolve('../guo-ui-vue3/lib')
// console.log('tem', resolve(__dirname));

async function copySourceCode() {
  // console.log('copySourceCode', SRC_DIR);
  return Promise.all([copy(SRC_DIR, ES_DIR)])
}
async function buildPackageScriptEntry() {
  const esEntryFile = join(ES_DIR, 'index.js')
  const libEntryFile = join(LIB_DIR, 'index.js')
  console.log('esEntryFile');
  genPackageEntry({
    outputPath: esEntryFile,
    pathResolver: (path: string) => `./${relative(SRC_DIR, path)}`
  })

  await copy(esEntryFile, libEntryFile)
}

/**
 * 生成组件样式入口
 */
async function buildStyleEntry() {
  await genStyleDepsMap()
  genComponentStyle()
}

async function buildESMOutputs() {
  setModuleEnv('esmodule')
  setBuildTarget('package')
  await compileDir(ES_DIR, 'esm')
}
async function buildCJSOutputs() {
  setModuleEnv('commonjs');
  setBuildTarget('package');
  await compileDir(LIB_DIR, 'cjs');
}

async function compileDir(dir: string, format: Format) {
  const files = await readdir(dir)
  await Promise.all(
    files.map((filename:string) => {
      const filePath = join(dir, filename)
      return isDir(filePath)
        ? compileDir(filePath, format)
        : compileFile(filePath, format)
    })
  )
}

async function compileFile(filePath:string, format: Format) {
  if(isScript(filePath)) {
    return compileScript(filePath, format)
  }
  if(isStyle(filePath)) {
    return compileStyle(filePath)
  }
  if(isAsset(filePath)) {
    return Promise.resolve()
  }
  return remove(filePath)
}

// 处理组件的样式入口文件（如 button.less）
async function buildPackageStyleEntry() {
  // 组件库中整体入口文件，如：/vue3/guo/packages/guo-ui-vue3/lib/index.less
  const styleEntryFile = join(LIB_DIR, `index.${CSS_LANG}`)
  // console.log('styleEntryFile', styleEntryFile);

  // 将组件库的每个组件的样式入口文件 引入到 lib/index.less中
  // 内容如下：
  // @import "./style/base.less";
  // @import "./badge/index.less";
  // @import "./icon/index.less";
  // @import "./button/index.less";
  genPackageStyle({
    outputPath: styleEntryFile,
    pathResolver: (path: string) => path.replace(SRC_DIR, '.')
  })
}

// 预编译
// 1. 移除不需要的目录
// 2. 编译sfc文件成script style

async function preCompileDir(dir: string) {
  const files = await readdir(dir)

  await Promise.all(
    files.map((filename)=> {
      const filePath = join(dir, filename)

      if(isDemoDir(filePath) || isTestDir(filePath)) {
        return remove(filePath)
      }
      if(isDir(filePath)) {
        return preCompileDir(filePath)
      }
      if(isSfc(filePath)) {
        return compileSfc(filePath)
      }
      return Promise.resolve()
    })
  )
}
// 构建类型声明
async function buildTypeDeclarations() {
  await Promise.all([preCompileDir(ES_DIR), preCompileDir(LIB_DIR)])

  // 读取ts声明文件并执行
  const tsConfig = join(process.cwd(), 'tsconfig.declaration.json');

  if (existsSync(tsConfig)) {
    await execa('tsc', ['-p', tsConfig]);
  }
}

async function buildBundledOutputs() {
  setModuleEnv('esmodule')
  await compileBundles()
}

const tasks = [
  {
    text: 'Copy Source Code',
    task: copySourceCode,
  },
  {
    text: 'Build Package Script Entry',
    task: buildPackageScriptEntry
  },
  {
    text: 'Build Component Style Entry',
    task: buildStyleEntry,
  },
  {
    text: 'Build Package Style Entry',
    task: buildPackageStyleEntry,
  },
  {
    text: 'Build Type Declarations',
    task: buildTypeDeclarations,
  },
  {
    text: 'Build ESModule Outputs',
    task: buildESMOutputs,
  },
  // {
  //   text: 'Build CommonJS Outputs',
  //   task: buildCJSOutputs,
  // },
  {
    text: 'Build Bundled Outputs',
    task: buildBundledOutputs,
  },
]
async function runBuildTasks() {
  console.log('runBuildTasks');
  
  for(let i = 0, len = tasks.length; i < len; i++) {
    const {task, text} = tasks[i]

    // const spinner = createSpinner(text).start()

    try {
      await task()
    } catch (error) {
      console.log('task-error', error
      );
      
    }
  }
}

export async function build() {
  setNodeEnv('production')

  try {
    await clean()
    await installDependencies()
    await runBuildTasks()
  } catch (error) {
    console.log('build failed', error)
    process.exit(1)
  }
}