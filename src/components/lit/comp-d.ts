import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("comp-d")
class CompD extends LitElement {
  render() {
    return html`
<view>comp-d</view>
<slot></slot>
    `;
  }
}