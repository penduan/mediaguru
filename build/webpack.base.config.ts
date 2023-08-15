import * as path from "path";

export const getAbsPath = (targetPath: string) => path.resolve(__dirname, "../", targetPath);

export const IS_DEV = process.env.NODE_ENV == "development";
export const IS_WECHAT = Reflect.has(process.env, "WECHAT");

/** 入口配置 */
const entries = {
  /** name: [path, generateHtml?] */
  index: ["src/pages/index.tsx", true],
  log: ["src/pages/log.tsx", true],
  main: ["src/pages/main.tsx", false],
  envEntries: {
    mp: {

    },
    web: {
      lit: ["src/components/lit/index.ts", false]
    }
  }
}

const generateHtml: string[] = [];

const getEntries = (env: "mp" | "web") => {
  let envEntires = entries['envEntries'];
  let commonPages = Object.keys(entries).filter((name) => name !== "envEntries");

  // @ts-ignore
  let pagesConfig = commonPages.map((item) => [item, entries[item]]);

  for (let name in  envEntires[env]) {
    // @ts-ignore
    pagesConfig.push([name, envEntires[env][name]]);
  }


  return Object.fromEntries(pagesConfig.map((item) => {
    let page = item[1];
    if (page[1]) {
      generateHtml.push(item[0]);
    }

    item[1] = page[0];

    return item;
  }))
}

const commonDefines = {
  "process.env.DEV": IS_DEV,
  "process.env.WECHAT": IS_WECHAT
}

export const webpackCommonBaseConfig = {
  entry: getEntries(IS_WECHAT ? "mp" : "web"),
  output: IS_WECHAT 
  ? {
    path: getAbsPath("./dist/mp/common"),
    filename: '[name].js',
    library: 'createApp',
    libraryExport: 'default',
    libraryTarget: 'window'
  } 
  : IS_DEV 
    ? { path: getAbsPath("./dist/web"),
      filename: '[name].js',
      publicPath: '/'
    } 
    : {
      path: getAbsPath("./dist/web"),
      filename: path.posix.join('static', 'js/[name].js'),
      chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js')
    }
  ,
  mode: IS_WECHAT ?  "production" : IS_DEV ? "development" : "production",
  module: {
    rules: [
      {test: /\.[t|j]sx?$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: {name: '[name].[ext]?[hash]'}}
    ]
  },
  resolve: {
    extensions: ['...', ".tsx", ".ts", '.jsx', '.json'],
    alias: { 
      src: getAbsPath("./src"),
      api: getAbsPath("./src/api"),
      wasm: getAbsPath("./wasm/"  + IS_WECHAT ? "mp" : "web"),
      wts: getAbsPath("./src/wts"),
      css: getAbsPath("./src/assets/css"),
    },
    fallback: {
      ...Object.fromEntries([
        "path",
        "pref_hook",
        "ws",
        "fs",
        "crypto",
        "http",
        "https",
        "worker_threads"
      ].map(item => [item, false])),
    }
  }
}

interface PluginsConfig {
  generateHtml: string[],
  defines: any,
  extensionManifest?: any
}

export const pluginsConfig: PluginsConfig = {
  generateHtml,
  defines: {
    ...commonDefines,
  }
}