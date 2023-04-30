
export default {
  // preset: "ts-jest",
  // // testEnvironment: 'jsdom', // 默认node,组件库测试需要改为’jsdom‘
  // transform: { 
  //   // "^.+\\.ts?$": "ts-jest",
  //   // "'^.+\.vue$'": '@vue/vue3-jest'
  //   // 将.js后缀的文件使用babel-jest处理
  //   // "^.+\\.js$": "babel-jest",
  //   // "^.+\\.(ts|tsx)$": "ts-jest"
  //   "^.+\\.(ts|tsx)$": "ts-jest",
  //   '^.+\\.vue$': 'vue-jest',
  // },
  // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\js$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}

// module.exports = {
//   moduleFileExtensions: ['js', 'ts', 'jsx', 'json', 'vue'],
//   transform: {
//     // '^.+\\.ts$': 'ts-jest',
//     "^.+\\.(ts|tsx)$": "ts-jest",
//     '^.+\\.vue$': 'vue-jest',
//   },
// }
