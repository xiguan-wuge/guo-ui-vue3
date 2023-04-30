import {execa} from 'execa'

export async function installDependencies() {
  console.info('Install Depdencies \n')

  try {
    await execa('pnpm', ['install', '--prod=false'], {
      stdio: 'inherit'
    })
  } catch (error) {
    console.log('Install Depdencies Error: ', error)
    throw error
  }
} 