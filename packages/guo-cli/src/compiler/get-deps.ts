import {join} from 'path'
import { readFileSync, existsSync } from 'fs';
import { SCRIPT_EXTS, STYLE_EXTS } from '../common/constant.js';

let depsMap:Record<string, string[]> = {}
let existsCache: Record<string, boolean> = {}

const IMPORT_RE =
  /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
const EXPORT_FROM_RE =
  /@?export\s+?(?:(?:(?:[\w*\s{},]*)\s+from(\s+)?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;

function matchImports(code: string): string[] {
  const imports = code.match(IMPORT_RE) || [];
  return imports.filter((line) => !line.includes('import type'));
}

function matchExportFroms(code: string): string[] {
  const exportFroms = code.match(EXPORT_FROM_RE) || []
  // 排除类型声明文件
  return exportFroms.filter((line) => !line.includes('export type'))
}

function getImportRelativePath(code: string) {
  const divider = code.includes('"') ? '"' : "'";
  return code.split(divider)[1];
}

function exists(filePath: string) {
  if (!(filePath in existsCache)) {
    existsCache[filePath] = existsSync(filePath);
  }

  return existsCache[filePath];
}

export function fillExt(filePath: string) {
  for (let i = 0; i < SCRIPT_EXTS.length; i++) {
    const completePath = `${filePath}${SCRIPT_EXTS[i]}`;
    if (exists(completePath)) {
      return {
        path: completePath,
        isIndex: false,
      };
    }
  }

  for (let i = 0; i < SCRIPT_EXTS.length; i++) {
    const completePath = `${filePath}/index${SCRIPT_EXTS[i]}`;
    if (exists(completePath)) {
      return {
        path: completePath,
        isIndex: true,
      };
    }
  }

  return {
    path: '',
    isIndex: false,
  };
}

function getPathByImport(code: string, filePath: string) {
  const relativePath = getImportRelativePath(code);

  if (relativePath.includes('.')) {
    return fillExt(join(filePath, '..', relativePath));
  }

  return null;
}


export function clearDepsCache() {
  depsMap = {}
  existsCache = {}
}

export function getDeps(filePath: string) {
  if (depsMap[filePath]) {
    return depsMap[filePath];
  }

  const code = readFileSync(filePath, 'utf-8');
  const imports = matchImports(code);
  const paths = imports
    .map((item) => getPathByImport(item, filePath)?.path)
    .filter((item) => !!item) as string[];

  depsMap[filePath] = paths;

  paths.forEach(getDeps);

  return paths;
}


/**
 * 1. 替换 .vue 后缀
 * @example 'import App from "App.vue"' => 'import App from "App.xxx"'
 * 
 * 2. 如果使用了.mjs 或者 .cjs 后缀的文件，补充完整的import path
 * @example import './foo' => import './foo.mjs'
 * @example import './foo' => import './foo/index.mjs'
 * 
 * @param code 
 * @param filePath 
 * @param ext 
 */
export function replaceScriptImportExt(
  code: string,
  filePath: string,
  ext: string
) {

  const imports = [...matchImports(code), ...matchExportFroms(code)]

  const updateImport = (index: number, newImport: string) => {
    code = code.replace(imports[index], newImport)
    imports[index] = newImport
  }

  imports.forEach((line, index) => {
    if(line.includes('.vue')) {
      updateImport(index, line.replace('.vue', ext))
    }
  })

  if(ext === '.mjs' || ext === '.cjs') {
    imports.forEach((line, index) => {
      const isStyleImport = STYLE_EXTS.some((ext) => line.includes(ext))
      if(isStyleImport) return

      const pathInfo = getPathByImport(line, filePath)
      if(pathInfo) {
        const relativePath = getImportRelativePath(line)

        // 替换为 button/index.mjs
        if(pathInfo.isIndex) {
          const newLine = line.replace(
            relativePath,
            `${relativePath}/index${ext}`
          )
          updateImport(index, newLine)
        } else {
          const newLine = line.replace(relativePath, relativePath+ext)
          updateImport(index, newLine)
        }
      }
    })
  }
  return code
}