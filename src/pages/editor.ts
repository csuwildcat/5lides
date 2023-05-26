import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import { DOM } from '../utils/dom.js';
import '../components/global.js'
import '../components/code-editor.js'

import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import revealStyles from 'reveal.js/dist/reveal.css';
import revealMoon from 'reveal.js/dist/theme/moon.css';

@customElement('page-editor')
export class PageEditor extends LitElement {
  static styles = [
    unsafeCSS(revealStyles),
    unsafeCSS(revealMoon),
    css`

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

      #editor_panels {
        height: 100%;
        width: 100%;

      }

      #editor_panels > * {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #editor_panels > * > * {
        height: 100%;
        width: 100%;
      }

      #code_editor::part(base) {
        height: 100%;
      }
    `
  ]

  constructor() {
    super();
  }

  $query(selector){
    return this.renderRoot.querySelector(selector);
  }

  async firstUpdated() {
    document.addEventListener('drawer-opened-changed', e => {
      setTimeout(() => this.refreshPreviewLayout(), 250);
    });
  }

  async onPageEnter(){
    const deckId = new URLSearchParams(location.search).get('deck')
    if (deckId !== this?.deck?.id) {
      this.deck = await datastore.getDeck(deckId);
    }
    if (this.deck) {
      console.log(this.deck);
      this.$query('#code_editor')?.setValue(this.deck.deckData.markdown);
      this.setPreviewContent(this.deck.deckData.markdown);
    }
    if (!this.preview) {
      this.preview = new Reveal(this.$query('#deck_preview'), {
        embedded: true,
        keyboardCondition: 'focused' // only react to keys when focused
      })
      this.preview.initialize({
        plugins: [ Markdown ],
      });
    }
  }

  async onPageLeave(){
    console.log('Examples page is hiding');
  }

  async setPreviewContent(content){
    let currentSlide = this?.preview?.getIndices() || { h: 0, v: 0 };
    const container = this.$query('#deck_preview .slides');
    container.innerHTML = `
      <section data-markdown>
        <textarea data-template>${content}</textarea>
      </section>
    `;
    const plugin = this?.preview?.getPlugin('markdown');
    if (plugin){
      plugin.processSlides(container);
      plugin.convertSlides();
      this.preview.slide(currentSlide.h, currentSlide.v, currentSlide.f);
    }
  }

  refreshPreviewLayout(throttle = 50){
    DOM.throttle(this?.preview?.layout, throttle);
    this?.preview?.sync();
  }

  render() {
    return html`
      <sl-split-panel id="editor_panels" @sl-reposition="${e => this.refreshPreviewLayout()}">
        <div slot="start">
          <code-editor id="code_editor" language="markdown" @change="${e => this.setPreviewContent(e.detail.editor.getValue())}"></code-editor>
        </div>
        <div slot="end">
          <div id="deck_preview" class="reveal">
            <div class="slides"></div>
          </div>
        </div>
      </sl-split-panel>
    `;
  }
}
