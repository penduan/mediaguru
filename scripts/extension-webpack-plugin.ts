import type { Compiler, WebpackPluginFunction, WebpackPluginInstance } from "webpack";
import fs from "fs";
import path from "path";

export default class ExtensionPlugin implements WebpackPluginInstance  {

  static PluginName = "ExtensionPlugin";

  constructor(public manifestConfig: any) {}
  
  apply(compiler: Compiler) {

    compiler.hooks.thisCompilation.tap(ExtensionPlugin.PluginName, (compilation) => {
      const outputPath = compilation.outputOptions.path ?? "";

      compilation.hooks.processAssets.tapAsync({
        name: ExtensionPlugin.PluginName,
      }, async (_, callback) => {

        if (Reflect.has(this.manifestConfig, "default_locale")) {
          let localeFilesPath = path.resolve(__dirname, "../src/locales");
          try {
            let files = fs.readdirSync(localeFilesPath);
            console.log(files);
            let promises =files.map(async (file) => {
              let localeName = file.split(".")[0];
              let fileInfo = await import(path.resolve(localeFilesPath, localeName)).then((mod) => mod.default);
  
              let localeFileInfo = Object.fromEntries(Object.keys(fileInfo).map((name) => {
                return [name, {message: fileInfo[name]}]
              }));
  
              compilation.assets[`_locales/${localeName}/messages.json`] = new compiler.webpack.sources.RawSource(JSON.stringify(localeFileInfo));
              return true;
            });

            await Promise.all(promises);
            callback();
          } catch(e) {}
      
        }

      });

      const configStr = JSON.stringify(this.manifestConfig);
      compilation.assets['manifest.json'] = new compiler.webpack.sources.RawSource(configStr);
    });
  }
}