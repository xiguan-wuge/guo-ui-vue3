import fse from 'fs-extra'
import path from 'path'
import hash from 'hash-sum'
import {
  parse,
  compileScript,
  SFCBlock,
  compileTemplate
} from 'vue/compiler-sfc'
import { replaceExt } from 'src/common'


const { remove, readFileSync, outputFile } = fse

const RENDER_FN = '__vue_render__';
const VUEIDS = '__vue_sfc__';
const EXPORT = 'export default';

export function parseSfc(filename: string) {
  const source = readFileSync(filename, 'utf-8')
  const { descriptor } = parse(source, {
    filename
  })

  return descriptor
}

function getSfcStylePath(filePath: string, ext: string, index: number) {
  const number = index !== 0 ? `-${index + 1}` : ''
  return replaceExt(filePath, `-sfc${number}.${ext}`)
}

// 将抽离的css样式，作为路径引入，写入到js文件中
function injectStyle(script: string, styles: SFCBlock[], filePath: string) {
  if(styles.length) {
    const imports = styles
      .map((style, index) => {
        const {base} = path.parse(getSfcStylePath(filePath, 'css', index))
        return `import './${base}';`
      })
      .join('\n')

    script = `${imports}\n${script}`
  }

  return script
}

// trim some unused code
function trim(code: string) {
  return code.replace(/\/\/\n/g, '').trim();
}
// 将render函数转换成script
function injectRender(script: string, render: string) {
  script = trim(script)

  render = render.replace('export function render', `function ${RENDER_FN}`)

  script += `\n${render}\n${VUEIDS}.render = ${RENDER_FN} \n`

  return script
}

function injectScopeId(script: string, scopeId: string) {
  script += `\n${VUEIDS}._scopeId = '${scopeId}'`;
  return script;
}

export function compileSfc(filePath: string): Promise<any> {
  // console.log('compileSfc: ', filePath);
  
  const tasks = [remove(filePath)]
  const source = readFileSync(filePath, 'utf-8')
  const descriptor = parseSfc(filePath)
  // console.log('descriptor: ', descriptor);

  const { template, styles } = descriptor

  const hasScoped = styles.some((s) => s.scoped)
  const scopeId = hasScoped ? `data-v-${hash(source)}` : ''
  // console.log('scopeId', scopeId);
  

  // 编译js部分
  if(descriptor.script || descriptor.scriptSetup) {
    const lang = 
      descriptor.script?.lang || descriptor.scriptSetup?.lang || 'js'
    const scriptFilePath = replaceExt(filePath, `.${lang}`)

    tasks.push(
      new Promise((resolve) => {
        let script = ''

        let bindingMetadata
        if(descriptor.scriptSetup) {
          const { bindings, content } = compileScript(descriptor, {
            id: scopeId
          })
          // console.log('bindings', bindings); // { data: 'setup-const' }
          // console.log('content', content);
          
          script += content
          bindingMetadata = bindings
        } else {
          script += descriptor.script!.content
        }

        script = injectStyle(script, styles, filePath)
        script = script.replace(EXPORT, `const ${VUEIDS} =`)


        if(template) {
          const render = compileTemplate({
            id: scopeId,
            source: template.content,
            filename: filePath,
            compilerOptions: {
              bindingMetadata
            }
          }).code

          script = injectRender(script,render)
        }

        if(scopeId) {
          script = injectScopeId(script, scopeId)
        }

        script += `\n ${EXPORT} ${VUEIDS}`

        if(lang === 'ts') {
          script = `// @ts-nocheck\n ${script}`
        }

        outputFile(scriptFilePath, script).then(resolve)
      })
    )
  }

  // 编译样式部分
  tasks.push(
    ...styles.map(async (style, index:number) => {
      const cssFilePath = getSfcStylePath(filePath, style.lang || 'css', index)

      const styleSource = trim(style.content)

      return outputFile(cssFilePath, styleSource)
    })
  )

  return Promise.all(tasks)
}

// desiptor: 
// {
//   filename: '/guo/packages/guo-ui-vue3/es/button-group/ButtonGroup.vue',
//   source: '<template>\n' +
//     '  <div class="g-button-group">这是 button-group</div>\n' +
//     '</template>\n' +
//     '\n' +
//     '<script lang="ts" setup>\n' +
//     "const data = 'button-group data'\n" +
//     "console.log('data', data);\n" +
//     '\n' +
//     '</script>\n' +
//     '<style lang="less">\n' +
//     '.g-button-group {\n' +
//     '  background-color: pink;\n' +
//     '  font-size: 16px;\n' +
//     '}\n' +
//     '</style>',
//   template: {
//     type: 'template',
//     content: '\n  <div class="g-button-group">这是 button-group</div>\n',
//     loc: {
//       source: '\n  <div class="g-button-group">这是 button-group</div>\n',
//       start: [Object],
//       end: [Object]
//     },
//     attrs: {},
//     ast: {
//       type: 1,
//       ns: 0,
//       tag: 'template',
//       tagType: 0,
//       props: [],
//       isSelfClosing: false,
//       children: [Array],
//       loc: [Object],
//       codegenNode: undefined
//     },
//     map: {
//       version: 3,
//       sources: [Array],
//       names: [],
//       mappings: ';EACE,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC',
//       file: '/Volumes/MacintoshHD/Users/guohuadong/workspace/codespace/vue3/guo/packages/guo-ui-vue3/es/button-group/ButtonGroup.vue',
//       sourceRoot: '',
//       sourcesContent: [Array]
//     }
//   },
//   script: null,
//   scriptSetup: {
//     type: 'script',
//     content: "\nconst data = 'button-group data'\nconsole.log('data', data);\n\n",
//     loc: {
//       source: "\nconst data = 'button-group data'\nconsole.log('data', data);\n\n",
//       start: [Object],
//       end: [Object]
//     },
//     attrs: { lang: 'ts', setup: true },
//     lang: 'ts',
//     setup: true
//   },
//   styles: [
//     {
//       type: 'style',
//       content: '\n.g-button-group {\n  background-color: pink;\n  font-size: 16px;\n}\n',
//       loc: [Object],
//       attrs: [Object],
//       lang: 'less',
//       map: [Object]
//     }
//   ],
//   customBlocks: [],
//   cssVars: [],
//   slotted: false,
//   shouldForceReload: [Function: shouldForceReload]
// }