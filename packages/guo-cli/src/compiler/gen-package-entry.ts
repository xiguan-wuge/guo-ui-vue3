import {join} from 'path'
import { SRC_DIR } from 'src/common/constant.js'
import {
  getComponents,
  pascalize,
  normalizePath,
  smartOutputFile
} from '../common/index.js'

type PathResolver = (path: string) => string

function getPathByName(name:string, pathResolver?: PathResolver) {
  let path = join(SRC_DIR, name)
  if(pathResolver) {
    path = pathResolver(path)
  }
  return normalizePath(path)
}

function genImports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean
): string {
  return names
    .map((name) => {
      const pascaName = pascalize(name)
      const importName = namedExport ? `{ ${pascaName} }` : pascaName
      const importPath = getPathByName(name, pathResolver)

      return `import ${importName} from '${importPath}'`
    })
    .join('\n')
}

function genExports(
  names: string[],
  pathResolver?: PathResolver,
  namedExport?: boolean
): string {
  if(namedExport) {
    const exports = names
      .map((name:string) => `export * from '${getPathByName(name, pathResolver)};'`)
      .join('\n')

    return `
export {
  install,
  version
}
  ${exports}
`
  }

  return `
export {
  install,
  version,
  ${names.map(pascalize).join(',\n  ')}
}
`
}


/**
 * 生成组件入口文件
 */
export function genPackageEntry({
  outputPath,
  pathResolver
}: {
  outputPath: string;
  pathResolver: PathResolver
}) {
  const names = getComponents()
  console.log('names', names);
  
  // const gConfig = getGConfig()

  // const namedExport = gConfig.build?.namedExport || false
  // const skitInstall = (gConfig.build?.skitInstall || []).map(pascalize)
  const skitInstall:string[] = [].map(pascalize)
  const namedExport = false
  // const version = process.env.PACKAGE_VERSION || getPackageJson().version

  const components = names.map(pascalize)
  // 批量生成import 引入
  const content = `${genImports(names, pathResolver, namedExport)}

const version = 'v1.0.0'

function install(app) {
  const components = [
    ${components.filter((item:string) => !skitInstall.includes(item)).join(',\n    ')}
  ]

  components.forEach(item => {
    if(item.install) {
      app.use(item)
    } else if(item.name) {
      app.component(item.name, item)
    }
  })
}

${genExports(names, pathResolver, namedExport)}

export default {
  install,
  version
}
`

  smartOutputFile(outputPath, content)
  
}