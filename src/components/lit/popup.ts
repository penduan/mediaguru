import { LitElement, PropertyDeclarations, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("td-popup")
class TdPopup extends LitElement {
  @property() visible = false;
  @property() placement = "top";
  
}