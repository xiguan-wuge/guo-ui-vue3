// import {Command} from 'commander'

// const program = new Command()
// const cliVersion = '1.0.0'
// program.version(`@guo/cli ${cliVersion}`);

// program
//   .command('build')
//   .description('Compile components is production mode')
//   .action(async () => {
//     const {build} = await import('./command/build.js')
//     return build()
//   })

import { build } from "./command/build";
build()