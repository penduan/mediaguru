import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("comp-a")
class CompA extends LitElement {
  static styles = css`
.prefix, .suffix {
  color: green;
}

.btn {
  margin: 15px 0;
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
}
  `;
  @property({type: String}) prefix = 'defaultPrefix';

  @property({type: String}) suffix = "defaultSuffix";

  @property({type: Object, hasChanged: (newVal, oldVal) => {
    console.log("observer testObj", newVal, oldVal);
    return true;
  }}) testObj:any = {};

  @property({type: Array}) testArr:any = [];

  @property({type: String}) testDefaultVal = "hello lit"

  @property({type: String, state: true}) str = "Hello comp-a";

  onTap() {
    console.log("custom event");
    let event = new CustomEvent("someevent", {bubbles: true, composed: true, detail: {
      from: "comp-a"
    }})
    this.shadowRoot?.dispatchEvent(event);
  }

  printf() {
    console.log('I am comp-a')
  }

  render() {
    return html`
<div>comp-a</div>
<button class="btn" @click=${this.onTap}>comp-a button</button>
<div>
<text class="prefix">${this.prefix}</text>-${this.str}-<text class="suffix">${this.suffix}</text></div>
<slot></slot>
<div>testObj: ${this.testObj.a} - ${this.testObj.b}</div>
<div>testArr: ${this.testArr.map((item: string) => html`<text>${item}</text>`)}</div>
<div>testDefaultVal: ${this.testDefaultVal}</div>
    `;
  }
}