import * as path from "path";

export const getAbsPath = (targetPath: string) => path.resolve(__dirname, "../", targetPath);

const IS_DEV = process.env.NODE_ENV == "development";
const IS_WECHAT = Reflect.has(process.env, "WECHAT");

const APPID = "wxdb2685dfafef3719";
const PROJECT_NAME = require("../package.json").name;
const ORIGIN = "https://gitcmd.pinquapp.com";
const AUTO_BUILD_NPM = 'npm';
/** 输出配置 */
const WEB_OUTPUT_PATH = getAbsPath("./dist/web");
const MP_OUTPUT_PATH = getAbsPath("./dist/mp/common");
/** 路径别名 */
const PATH_ALIAS = {
  src: getAbsPath("./src"),
  api: getAbsPath("./src/api"),
  wasm: getAbsPath("./wasm/"  + IS_WECHAT ? "mp" : "web"),
  wts: getAbsPath("./src/wts"),
  css: getAbsPath("./src/assets/css"),
}
/** 要解析的扩展后缀 */
const RESOLVE_EXTS =['...', ".tsx", ".ts", '.jsx', '.json'];

/**
 * 静态文件复制
 * to 相对于 MP_OUTPUT_PATH/WEB_OUTPUT_PATH
 */
const MP_COPY = [// [ from , to]
  ["./wasm/mp/lg2.wasm.br", "../assets"]
];
const WEB_COPY = [// [from, to]
  ["./wasm/web/lg2.wasm", "."]
];

/** 全局定义 - 用于摇树(tree-shaking)支持 */
const COMMON_DEFINES = {
  "process.env.DEV": IS_DEV,
  "process.env.WECHAT": IS_WECHAT
}
const MP_DEFINE_COFNIG = {
  ...COMMON_DEFINES,
}
const WEB_DEFINE_CONFIG = {
  ...COMMON_DEFINES,

}

/** 
 * 入口配置 - 使用项目相对路径
 * 
 * 共用的入口
 */
const COMMON_ENTRIES = {
  index: "src/pages/index.tsx",
  log: "src/pages/log.tsx",
  main: 'src/pages/main.tsx',
}
const MP_ENTRIES = {
  ...COMMON_ENTRIES,
}
const WEB_ENTRIES = {
  ...COMMON_ENTRIES,
  lit: "src/components/lit/index.ts"
}

/**
 * 小程序打包插件配置
 * @see https://wechat-miniprogram.github.io/kbone/docs/config/
 */
const MP_PLUGIN_CONFIG = {
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


const copyFunc = (item: string[]) => ({from: item[0], to: item[1]});

export default {
  isDev: IS_DEV,
  commonWebpackConfig: {
    module: {
      rules: [
        {
          test: /\.[t|j]sx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
          },
        },
      ]
    },
    resolve: {
      extensions: RESOLVE_EXTS,
      alias: PATH_ALIAS,
      fallback: {
        path: false,
        pref_hook: false,
        ws: false,
        fs: false,
        crypto: false,
        http: false,
        https: false,
        worker_threads: false
      }
    }
  },
  mp: {
    copy: MP_COPY.map(copyFunc),
    mpPlugin: MP_PLUGIN_CONFIG,
    entry: MP_ENTRIES,
    output: {
      path: MP_OUTPUT_PATH,
      // 放到小程序代码目录中的 common 目录下
      filename: '[name].js', // 必需字段，不能修改
      library: 'createApp', // 必需字段，不能修改
      libraryExport: 'default', // 必需字段，不能修改
      libraryTarget: 'window', // 必需字段，不能修改
    },
    defines: MP_DEFINE_COFNIG,
  },
  web: {
    page: [],
    copy: WEB_COPY.map(copyFunc),
    entry: WEB_ENTRIES,
    output: IS_DEV 
      ? {
        path: WEB_OUTPUT_PATH,
        filename: '[name].js',
        publicPath: '/'
      }
      : {
        path: WEB_OUTPUT_PATH,
        filename: path.posix.join('static', 'js/[name].js'),
        chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js')
      },
    defines: WEB_DEFINE_CONFIG
  }
}