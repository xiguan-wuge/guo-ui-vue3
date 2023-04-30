import fse from 'fs-extra'
import {resolve} from 'path'
// import {
//   ES_DIR,
//   LIB_DIR,
//   DIST_DIR,
//   SITE_DIST_DIR
// } from '../common/constant/js'

const {remove} = fse
const ES_DIR = resolve('./', '../../es')
export async function clean() {
  await Promise.all([
    remove(ES_DIR)
    // remove(LIB_DIR)
    // remove(DIST_DIR)
    // remove(SITE_DIST_DIR)
  ])
}