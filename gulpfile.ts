import { Stats, rename, readFileSync, writeFileSync } from "fs";
import { watch } from "gulp";
import { exec } from "child_process";

export default () => {
  const repalceHeader ='"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });'
  let watcher = watch("./dist/mp/wxs/**/*.js", {delay: 1000});
  // @ts-ignore
  let listener = (filepath: string, stats: Stats) => {
    let newFilePath = filepath.replace(/.js$/, ".wxs");
    newFilePath = newFilePath.replace(/\/wts\//, "/");
    rename(filepath, newFilePath, (err) => {
      if (err) return console.error(err);

      console.log("\x1b[32m%s", newFilePath);
      let fileData = readFileSync(newFilePath, "utf8");
      let newHeader = "module.exports = {};\nvar exports = module.exports;";

      if (/Object\.defineProperty(.*?get:.*?);\n/g.test(fileData)) {
        newHeader += "\nvar Object = require('./polyfill.wxs').Object;";
      }

      fileData = fileData.replace(repalceHeader, newHeader);
      let reg = /require\("(.*?)"\);/g;
      let matchs = fileData.matchAll(reg);
      for (let result of matchs) {
        let pathStr = result[1];
        pathStr += ".wxs";
        if (/\/wts\//.test(filepath) && pathStr.slice(0, 2) === "..") {
          pathStr = pathStr.slice(1);
        }

        fileData = fileData.replace(result[1], pathStr);
      }

      writeFileSync(newFilePath, fileData);
    });
  }
  watcher.on("change", listener);
  watcher.on("add", listener);
  exec(`npx tsc --project ./src/wts/tsconfig.es5.json --watch`); 
}