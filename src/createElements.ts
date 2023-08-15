import { CompA } from "./components/common/comp-a";
import fs from "fs";

const compCode = CompA.toString();
const staticProperties = Object.getOwnPropertyNames(CompA);

const tplCode = fs.readFileSync(CompA.tpl, "utf8");

console.log(compCode.replace(/static.*\s*\(?\)?\s*{?([\s\S]*?)};/gm, ""));
console.log(staticProperties);
let tplLines = tplCode.split("\n");

let tabSpace = 2;
let rootNodes:any = [];

const BLOCK_EOL = /}$/;
const MAP_BLOCK_S = /{/g;
const MAP_BLOCK_E = /}/g;
const TAB_SPACE = new RegExp(new Array(tabSpace).fill(" ").join(""), "g");

/** 在块内 */
let atBlock = false;
let currentBlockLevel = 0;


/** 当前层级 */
let currentLevel = 0;
let parents: any = [];
let currentParent = [];
/** 缓存未结束的块 */
let cacheBlock = "";

/** 格式化块获取节点 */
while(tplLines.length) { // 遍历所有块
  let line = tplLines.shift();
  if (!line || !line.trim()) continue; // empty line.
  line = line.trimEnd();
  let node: any = {}
  let matchedLine = line.replace(/\\{/g, "").replace(/\\}/g, "");
  if (!atBlock && BLOCK_EOL.test(line) && matchedLine.match(MAP_BLOCK_S)?.length === matchedLine.match(MAP_BLOCK_E)?.length) { // single line
    let len = line.match("{")!.index;
    let tag = line.slice(0, len).trim();
    let block = line.slice(len);
    parserBlock(block);
    node.tag = tag;
    node.block = block;
    node.children = [];

    let currentLineMatchResult = line.match(TAB_SPACE);
    if (!currentLineMatchResult) { // root node
      rootNodes.push(node);
      parents = [];
      currentParent = node.children;
      currentLevel = 0;
    } else if (currentLevel < currentLineMatchResult.length) { // jump next level
      parents.push(currentParent);
      currentParent.push(node);
      currentParent = node.children;
      currentLevel += 1;
    } else if (currentLevel > currentLineMatchResult.length) { // jump prev level
      currentParent = parents.pop();
      currentParent.push(node);
      currentLevel -= 1;
    } else { // same level with last.
      // console.log(currentParent);
      currentParent.push(node);
      currentParent = node.children;

    }

    continue;
  }

  if ( !atBlock && matchedLine.match(MAP_BLOCK_S)) { // multi line block
    atBlock = true;
    cacheBlock = line;
    continue;
  }
  if (atBlock) {// atBlock
    cacheBlock = cacheBlock.concat(line.trim());
    if (cacheBlock.match(MAP_BLOCK_S)?.length === cacheBlock.match(MAP_BLOCK_E)?.length){
      let len = cacheBlock.match("{")!.index;
      let tag = cacheBlock.slice(0, len).trim();
      let block = cacheBlock.slice(len);
      parserBlock(block);
      node.tag = tag;
      node.block = block;
      node.children = [];

      let currentLineMatchResult = cacheBlock.match(TAB_SPACE);
      if (!currentLineMatchResult) { // root node
        rootNodes.push(node);
        parents = [];
        currentParent = node.children;
        currentLevel = 0;
      } else if (currentLevel < currentLineMatchResult.length) { // jump next level
        parents.push(currentParent);
        currentParent.push(node);
        currentParent = node.children;
        currentLevel += 1;
      } else if (currentLevel > currentLineMatchResult.length) { // jump prev level
        currentParent = parents.pop();
        currentParent.push(node);
        currentLevel -= 1;
      } else { // same level with last.

        // error.
        currentParent.push(node);
        currentParent = node.children;
      }
      
      cacheBlock = "";
      atBlock = false;

    } 
  } else {

    let matchResult = line.match(/(".*?")/g);
    let replacedLine = line;
    if (matchResult) {
      matchResult.map((value, index) => {
        let name = "$"+index;
        replacedLine = replacedLine.replace(value, name);
        return [name, value];
      });
    }
    let vals = replacedLine.split("+").map((item) => item.trim());
    // vals.map(())
    // console.log("text", line, replacedLine, vals);

    let tag = "text";
    node.tag = tag;
    node.value = vals;

    let currentLineMatchResult = line.match(TAB_SPACE);
    if (!currentLineMatchResult) { // root node
      rootNodes.push(node);
      parents = [];
      currentParent = [];
      currentLevel = 0;
    } else if (currentLevel < currentLineMatchResult.length) { // jump next level
      currentParent.push(node);
      currentLevel += 1;
    } else if (currentLevel > currentLineMatchResult.length) { // jump prev level
      currentParent = parents.pop();
      currentParent.push(node);
      currentLevel -= 1;
    } else { // same level with last.
      currentParent.push(node);
    }
  }
}

// console.log(JSON.stringify(rootNodes, undefined, 2));

enum AttrValueType {
  string = 1,
  property,
  mixed,
  method,
  func
}

enum AttrType {
  boolean = 1,
  property,
  event
}

function parserBlock(blockStr: string) {
  let mapStartMatchResult = blockStr.match(MAP_BLOCK_S);
  blockStr = blockStr.trim();
  let isMapStartScope = blockStr.slice(0, 1) === "{";
  let isMapEndScope = blockStr.slice(blockStr.length - 1) === "}";
  if (!mapStartMatchResult || !isMapStartScope || !isMapEndScope) {
    throw new Error("Fatal error: Block is not full esb." +blockStr);
  } else {
    blockStr = blockStr.slice(1, blockStr.length - 1);
  }

  if (mapStartMatchResult.length === 1) { // single map block
    let attrs = blockStr.trim().split(",");
    let entries = attrs.map((attr) => {
      let entry = attr.split(":");
      let name = entry[0].trim();
      let value: string | string[] = entry[1].trim();
      let valueType: AttrValueType;

      if (!/[\?|\@]./.test(name)) { // attribute/property
        let stringMatchResult = value.match(/(".*?")/g);
        if (stringMatchResult) {
          if (stringMatchResult.length === 1 && value.slice(0, 1) == '"' && value.slice(value.length - 1) == '"') {
            valueType = AttrValueType.string;
          } else {
            valueType = AttrValueType.mixed;
            value = value.split("+");
          }
        } else {
          valueType = AttrValueType.property;
          value = value.split("+");
        }
      } else { // boolean attribute & event lifecycle.
        

      }
      
    });
  } else { // mutliple map block
    console.log("multi:", blockStr);
  }

}

