import {resolve, join, dirname, isAbsolute} from 'path'
import {fileURLToPath} from 'url'
import { existsSync, readFileSync } from 'fs';


export const EXT_REGEXP = /\.\w+$/;
export function replaceExt(path: string, ext: string) {
  return path.replace(EXT_REGEXP, ext);
}

// Root Path
export const CWD = process.cwd();
// export const ROOT = findRootDir(CWD);
export const ROOT = resolve('../guo-ui-vue3');

export const PACKAGE_JSON_FILE = join(ROOT, 'package.json');

// export ES_LIB = join()
export const SRC_DIR = resolve('../guo-ui-vue3/packages')
export const ES_DIR = resolve('../guo-ui-vue3/es')
export const LIB_DIR = resolve('../guo-ui-vue3/lib')


// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url))
export const DIST_DIR = join(__dirname, '..', '..', 'dist');
export const CJS_DIR = join(__dirname, '..', '..', 'cjs');

// Dist files
export const STYLE_DEPS_JSON_FILE = join(DIST_DIR, 'style-deps.json')

// Config files
export const POSTCSS_CONFIG_FILE = join(CJS_DIR, 'postcss.config.cjs')

export const SCRIPT_EXTS = [
  '.js',
  '.jsx',
  '.vue',
  '.ts',
  '.tsx',
  '.mjs',
  '.cjs',
];
export const STYLE_EXTS = ['.css', '.less', '.scss'];

export function getGConfig() {
  return {
    build : {
      css: {
        removeSoureFile: false,
      },
      extensions: {
        esm: '.mjs'
      }
    },
    name: 'g-ui'
  }
}

// export const SRC_DIR = getSrcDir();
export const STYLE_DIR = join(SRC_DIR, 'style');

export function getPackageJson() {
  // console.log('PACKAGE_JSON_FILE', PACKAGE_JSON_FILE);
  const rawJson = readFileSync(PACKAGE_JSON_FILE, 'utf-8');
  return JSON.parse(rawJson);
}

