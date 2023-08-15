import { getAbsPath } from "./config";

const APPID = "wxdb2685dfafef3719";
const PROJECT_NAME = require("../package.json").name;
const ORIGIN = "https://gitcmd.pinquapp.com";
const AUTO_BUILD_NPM = 'npm';

/**
 * 小程序打包插件配置
 * @see https://wechat-miniprogram.github.io/kbone/docs/config/
 */
export default {
  origin: ORIGIN,
  entry: '/',
  router: {
    home: [
      '/(home|index)?',
      '/index.html',
      '/test/(home|index)',
    ],
    other: [
      '/test/list/:id',
      '/test/detail/:id',
    ],
  },
  redirect: {
    notFound: 'home',
    accessDenied: 'home',
  },
  generate: { 
    autoBuildNpm: AUTO_BUILD_NPM,
    wxCustomComponent: {
      root: getAbsPath("./src/components/custom-components"),
      usingComponents: {
        'comp-a': {
          path: 'comp-a',
          props: ['prefix', 'suffix', 'testObj', 'testArr', 'testDefaultVal'],
          propsVal: ['', '', {}, [], 'hello kbone'],
          events: ['someevent']
        },
        'comp-b': {
          path: 'comp-b/index',
          props: ['prefix', 'name']
        },
        'comp-c': 'comp-c',
        'comp-e': {
          path: 'comp-e/index',
          props: ['my-class'],
          externalWxss: ['main']
        }
      }
    }
  },
  app: {
    navigationBarTitleText: PROJECT_NAME,
  },
  appExtraConfig: {
    sitemapLocation: 'sitemap.json',
    useExtendedLib: { weui: true }
  },
  global: {},
  pages: {},
  optimization: {
    domSubTreeLevel: 10,
    elementMultiplexing: true,
    textMultiplexing: true,
    commentMultiplexing: true,
    domExtendMultiplexing: true,

    styleValueReduce: 5000,
    attrValueReduce: 5000,
  },
  projectConfig: {
    projectname: PROJECT_NAME,
    appid: APPID,
  },
}