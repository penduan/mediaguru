import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("comp-b")
class CompB extends LitElement {
  static styles = css`
.prefix, .suffix {
  color: green;
}
  `;
  @property({type: String}) prefix = "defaultPrefix";
  @property({type: String}) suffix = "defaultSuffix";
  @property({type: String}) name = "";

  @property({type: String, state: true}) str = "Hello, comp-b";

  render() {
    return html`
<div>comp-b</div>
<div><text class="prefix">${this.prefix}</text>-${this.str}-<text class="suffix">${this.suffix}</text>-${this.name}</div>
<slot></slot>
    `;
  }
}