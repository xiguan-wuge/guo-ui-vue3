export default {
  // 组件库名称
  name: 'guo-ui',
  // 构建配置
  build: {
    site: {
      publicPath: '/guo-ui/',
    },
    css: {
      base: 'demo-assets/style/global.less'
    }
  },
  // 文档站点配置
  site: {
    // 标题
    title: 'GUO UI',
    // 图标
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    // 描述
    description: '示例组件库',
    // 左侧导航
    nav: [
      {
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'button',
            title: 'Button 按钮',
          },
        ],
      },
    ],
  },
};