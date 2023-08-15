import type { IExtensionManifest } from "./manifestTypes";

import { author, version } from "../package.json";

/** @link [manifest file format](https://developer.chrome.com/docs/extensions/mv3/manifest/) */
const manifestConfig: IExtensionManifest = {
  name: "__MSG_appName__",
  version,
  author,
  default_locale: "en",
  description: "__MSG_appDesc__",
  manifest_version: 3,
  minimum_chrome_version: "88",
  /** @link [权限声明](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/) */
  permissions: [
    "storage",
    "unlimitedStorage",
  ],
  /** @link [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) */
  content_scripts: [
    {
      js: 
      process.env.NODE_ENV ? 
        [
          "context.js",
          "lit.js",
          "ui.js",
          "main.js"
        ] 
        : [
        "static/context.js",
        "static/lit.js",
        "static/ui.js",
        "static/main.js"
      ],
      matches: ["https://chat.openai.com/*"]
    }
  ],
  background: {
    service_worker: process.env.NODE_ENV ? "static/background.js" : "background.js"
  },

  /** @link [内容安全政策](https://developer.chrome.com/docs/extensions/mv3/manifest/content_security_policy/) */
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  },
  
}

export default manifestConfig;