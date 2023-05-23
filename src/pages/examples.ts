import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('page-examples')
export class PageExamples extends LitElement {
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
    console.log('This is the examples page');
  }

  async onPageEnter(){
    console.log('Examples page is showing');
  }

  async onPageLeave(){
    console.log('Examples page is hiding');
  }

  render() {
    return html`
      <h2>Storing images in your DWeb Nodes</h2>
      <sl-carousel pagination navigation mouse-dragging loop>
        <sl-carousel-item></sl-carousel-item>
      </sl-carousel>
    `;
  }
}
