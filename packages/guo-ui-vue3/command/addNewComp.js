/**
 * 新增组件模板脚本
 */

import consola from 'consola';
import inquirer from 'inquirer';
import fs, { pathExists } from 'fs-extra';
import { sep, join } from 'path';
import glob from 'fast-glob';
import color from 'picocolors';

const CWD = process.cwd();
const template = 'template/newCompTemplate'
function camelize(str) {
  const camelizeRE = /-(\w)/g
  return str.replace(camelizeRE, (_, c) => {
    return c.toUpperCase()
  })
}
class AddCompGenerator {
  outputDir = ''
  inputs = {
    name: '',
    componentName: ''

  }

  constructor(name, outputDir) {
    this.inputs.name = name
    this.outputDir = outputDir
    this.inputs.componentName = camelize(name[0].toUpperCase() + name.slice(1))
    console.log('this.inputs.componentName', this.inputs.componentName);
  }

  async run() {
    await this.writing()
    this.end()
  }
  writing() {
    const templatePath = join(CWD, template)
    const templateFiles = glob.sync(
      join(templatePath, '**', '*').replace(/\\/g, '/'),
      {
        dot: true,
      }
    );
    templateFiles.forEach((filePath) => {
      const outputPath = filePath
        .replace('.tpl', '')
        .replace('componentFile', this.inputs.componentName)
        .replace(templatePath, this.outputDir);
      this.copyTpl(filePath, outputPath, this.inputs);
    });
  }
  copyTpl(from, to, args) {
    fs.copySync(from, to);
    let content = fs.readFileSync(to, 'utf-8');

    Object.keys(args).forEach((key) => {
      const regexp = new RegExp(`<%= ${key} %>`, 'g');
      content = content.replace(regexp, args[key]);
    });

    fs.writeFileSync(to, content);

    const name = to.replace(this.outputDir + sep, '');
    consola.success(`${color.green('create')} ${name}`);
  }
  end() {
    const { name } = this.inputs;

    console.log();
    consola.success(`Successfully created ${color.yellow(name)}.`);
  }
}

const PROMPT = [
  {
    type: 'input',
    name: 'name',
    message: 'Input Your Component Name'
  }
]

async function run() {
  try {
    const {name} = await inquirer.prompt(PROMPT)
    const outputDir = join(CWD, `packages/${name}`)
    const exists = await pathExists(outputDir)
    if(exists) {
      consola.error('new component has exsit!, if you want to add new, please remove current component dirtory!')
      return
    } else {
      const generator = new AddCompGenerator(name, outputDir)
      await generator.run()
    }
    
  } catch (error) {
    console.log('\n add new component error: \n', error);
  }
}
run()

