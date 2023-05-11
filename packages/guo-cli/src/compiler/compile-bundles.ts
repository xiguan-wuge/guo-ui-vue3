import { getGConfig, getPackageJson } from 'src/common/constant';
import type { LibraryFormats } from 'vite';
import { build } from 'vite';
import { mergeCustomViteConfig } from '../common/index.js';
import { getViteConfigForPackage } from '../config/vite.package.js';

export type BundleOption = {
  minify?: boolean;
  formats: LibraryFormats[];
  external?: string[];
};

export async function compileBundles() {
  const dependencies = getPackageJson().dependencies || {}
  // console.log('dependencies', dependencies);
  
  const external = Object.keys(dependencies)

  // console.log('external', external);
  
  const DEFAULT_OPTIONS: BundleOption[] = [
    {
      minify: false,
      formats: ['umd']
    },
    {
      minify: true,
      formats: ['umd']
    },
    {
      minify: false,
      formats: ['es', 'cjs'],
      external
    }
  ]

  const bundleOptions: BundleOption[] = 
    getGConfig().build?.bundleOptions || DEFAULT_OPTIONS

  // console.log('bundleOptions', bundleOptions);
  
  await Promise.all(
    bundleOptions.map(async (config) => {
      // build(
      //   await mergeCustomViteConfig(
      //     getViteConfigForPackage(config),
      //     'production'
      //   )
      // )
    })
  )
}