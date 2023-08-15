import path from "path";

class BaseComponent {
  triggerEvent(...args: any) {

  }
}

export class CompA extends BaseComponent {

  static tpl = path.resolve(__dirname, "comp-a.tpl");
  
  static properties = {
    prefix: {
      type: String,
      value: ""
    },
    suffix: {
      type: String,
      value: ""
    },
    testObj: {
      type: Object,
      value: {}
    },
    testArr: {
      type: Array,
      value: []
    },
    testDefaultVal: "hello world"
  };

  static data = {
    str: "Hello comp-a"
  };

  static onTap(this: CompA, a: string) {
    console.log("custom event");
    this.triggerEvent("someevent", {from: "comp-a"}, {bubbles: true, composed: true});
  }

  printf() {
    console.log('I am comp-a');
  }

}