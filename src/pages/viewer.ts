import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-viewer')
export class PageViewer extends LitElement {
  static styles = [
    css`

      :host > * {
        max-width: var(--content-max-width);
      }

      :host > section {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      :host([state="active"]) {
        z-index: 1;
      }

      :host([state="active"]) > section {
        opacity: 1;
      }
    `
  ]

  constructor() {
    super();
  }

  async firstUpdated() {

  }

  async onPageEnter(){

  }

  async onPageLeave(){

  }

  render() {
    return html`
      <section style="height: 1900px">
        If you need a settings page, put it here.
      </section>
    `;
  }
}
