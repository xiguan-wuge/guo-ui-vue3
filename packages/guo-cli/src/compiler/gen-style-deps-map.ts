import {join, relative, sep} from 'path'
import {existsSync} from 'fs'
import { getComponents, smartOutputFile } from "src/common";
import { SRC_DIR, STYLE_DEPS_JSON_FILE } from '../common/constant.js';
import { getDeps, clearDepsCache, fillExt } from './get-deps.js';
import { CSS_LANG } from '../common/css.js';


function matchPath(path: string, component: string): boolean {
  const p = relative(SRC_DIR, path);
  const arr = p.split(sep);
  return arr.includes(component);
}

type DepsMap = Record<string, string[]>

function getStylePath(component:string) {
  return join(SRC_DIR, `${component}/index.${CSS_LANG}`)
}

export function checkStyleExists(component:string) {
  return existsSync(getStylePath(component))
}

// 分析组件依赖
function analyzeComponentDeps(components:string[], component:string) {
  const checkList: string[] = []
  const componentEntry = fillExt(join(SRC_DIR, component, 'index')).path
  const record = new Set()

  function search(filePath: string) {
    record.add(filePath)

    getDeps(filePath).forEach((key) => {
      if(record.has(key)) {
        return
      }

      search(key)

      components
        .filter((item) => matchPath(key, item))
        .forEach((item) => {
          if(!checkList.includes(item) && item !== component) {
            checkList.push(item)
          }
        })
    })
  }

  search(componentEntry)

  return checkList.filter(checkStyleExists)
}


function getSequence(components: string[], depsMap: DepsMap) {
  const sequence: string[] = [];
  const record = new Set();

  function add(item: string) {
    const deps = depsMap[item];

    if (sequence.includes(item) || !deps) {
      return;
    }

    if (record.has(item)) {
      sequence.push(item);
      return;
    }

    record.add(item);

    if (!deps.length) {
      sequence.push(item);
      return;
    }

    deps.forEach(add);

    if (sequence.includes(item)) {
      return;
    }

    const maxIndex = Math.max(...deps.map((dep) => sequence.indexOf(dep)));

    sequence.splice(maxIndex + 1, 0, item);
  }

  components.forEach(add);

  return sequence;
}

export async function genStyleDepsMap() {
  const components = getComponents()

  return new Promise<void>((resolve) => {
    clearDepsCache()

    const map = {} as DepsMap

    components.forEach((component:string) => {
      map[component] = analyzeComponentDeps(components, component)
    })
    // console.log('map: ', map);

    const sequence = getSequence(components, map)

    Object.keys(map).forEach((key) => {
      map[key] = map[key].sort(
        (a, b) => sequence.indexOf(a) - sequence.indexOf(b)
      )
    })

    smartOutputFile(
      STYLE_DEPS_JSON_FILE,
      JSON.stringify({map, sequence}, null, 2)
    )

    resolve()
  })
}