import {resolve, join, dirname, isAbsolute} from 'path'
import {fileURLToPath} from 'url'
// Root Path

// export ES_LIB = join()
export const SRC_DIR = resolve('../guo-ui-vue3/packages')
export const ES_DIR = resolve('../guo-ui-vue3/es')
export const LIB_DIR = resolve('../guo-ui-vue3/lib')

// Relative paths
const __dirname = dirname(fileURLToPath(import.meta.url))
export const DIST_DIR = join(__dirname, '..', '..', 'dist');

// Dist files
export const STYLE_DEPS_JSON_FILE = join(DIST_DIR, 'style-deps.json')

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
      }
    }
  }
}

// export const SRC_DIR = getSrcDir();
export const STYLE_DIR = join(SRC_DIR, 'style');