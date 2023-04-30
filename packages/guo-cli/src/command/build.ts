import fse from 'fs-extra'
import {resolve, join, relative} from 'path'
import {clean} from './clean.js'
import { installDependencies } from '../common/manager.js';
import { genPackageEntry } from '../compiler/gen-package-entry.js';
import { genStyleDepsMap } from '../compiler/gen-style-deps-map.js';
import { genComponentStyle } from '../compiler/gen-component-style.js';

import {
  setNodeEnv
} from '../common/index.js'
import {
  SRC_DIR,
  ES_DIR,
  LIB_DIR
} from '../common/constant.js'

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
  // {
  //   text: 'Build Package Style Entry',
  //   task: buildPackageStyleEntry,
  // },
  // {
  //   text: 'Build Type Declarations',
  //   task: buildTypeDeclarations,
  // },
  // {
  //   text: 'Build ESModule Outputs',
  //   task: buildESMOutputs,
  // },
  // {
  //   text: 'Build CommonJS Outputs',
  //   task: buildCJSOutputs,
  // },
  // {
  //   text: 'Build Bundled Outputs',
  //   task: buildBundledOutputs,
  // },
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