import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("comp-c")
class CompC extends LitElement {
  render() {
    return html`
<div>comp-c</div>
<comp-d>
    <div>comp-d slot</div>
</comp-d>
<slot></slot>
    `;
  }
}