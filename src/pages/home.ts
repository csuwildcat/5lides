import { LitElement, css, html, unsafeCSS } from 'lit';
import { when } from 'lit/directives/when.js';
import { property, customElement } from 'lit/decorators.js';

import '../components/global.js'

@customElement('page-home')
export class PageHome extends LitElement {

  constructor() {
    super();
    this.decks = [];
    datastore.ready.then(async () => {
      this.decks = await datastore.getDecks();
      this.requestUpdate();
    });
  }

  static get styles() {
    return [
      css`

      /* :host > * {
        max-width: var(--content-max-width);
      } */

      #view_header {
        position: sticky;
        top: 0;
        max-width: none;
        padding: 1.1em 1.2em 1em;
        background: rgba(44 44 49 / 50%);
        border-bottom: 1px solid rgba(0 0 0 / 50%);
      }

      #decks {
        margin: 2em;
      }

      #decks sl-card {
        max-width: 300px;
        margin: 1em;
      }

      #decks sl-card::part(image) {
        border: 1px solid rgba(255 255 255 / 10%);
      }
      #decks sl-card h3 {
        margin-top: 0;
      }

      #create_deck_name {
        margin-bottom: 1em;
      }

    `];
  }

  $query(selector){
    return this.renderRoot.querySelector(selector);
  }

  async firstUpdated() {
    console.log('This is your home page');
  }

  async onPageEnter(){
    console.log('Home page is showing');
  }

  async onPageLeave(){
    console.log('Home page is hiding');
  }

  async createDeck(name, description){
    name = name.trim();
    description = description.trim();
    if (!name) {
      DOM.fireEvent(this, 'app-notify', {
        composed: true,
        detail: {
          variant: 'danger',
          duration: 4000,
          message: 'You must provide a name for your deck'
        }
      })
    }
    else {
      try {
const { record } = datastore.createDeck({
name,
description,
markdown: `
## Slide 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
---
## Slide 2
Augue neque gravida in fermentum. In mollis nunc sed id semper.
---
## Slide 3
Tellus mauris a diam maecenas sed. At imperdiet dui accumsan sit amet.
`
});
        this.decks.push(record);
        DOM.fireEvent(this, 'app-notify', {
          composed: true,
          detail: {
            variant: 'success',
            duration: 4000,
            message: `Deck created: ${name}`
          }
        })
        this.requestUpdate();
        this.closeModal('#create_deck_modal');
      }
      catch(e) {
        DOM.fireEvent(this, 'app-notify', {
          composed: true,
          detail: {
            variant: 'danger',
            duration: 4000,
            message: 'There was an error in creating your deck'
          }
        })
      }
    }
  }

  openModal(selector){
    this.renderRoot.querySelector(selector).show()
  }

  closeModal(selector){
    this.renderRoot.querySelector(selector).hide()
  }

  render() {
    return html`
      <header id="view_header">
        <sl-button-group id="view_actions">
          <sl-button variant="primary" size="small" @click="${e => this.openModal('#create_deck_modal')}">
            <sl-icon slot="prefix" name="plus-lg"></sl-icon>
            New Deck
          </sl-button>
        </sl-button-group>
      </header>

      <div id="decks">
        ${
          this.decks.map(deck => {
            return html`
              <sl-card class="card-overview">
                <!-- <img
                  slot="image"
                  src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
                /> -->

                <h3>${deck.deckData.name}</h3>
                <p></p>
                <small>Created: ${new Date(deck.dateCreated).toLocaleDateString()}</small>

                <div slot="footer">
                  <sl-button variant="success" size="small" href="/viewer?deck=${deck.id}">
                    <sl-icon slot="prefix" name="eye-fill"></sl-icon>
                    View Deck
                  </sl-button>
                  <sl-button variant="primary" size="small" href="/editor?deck=${deck.id}">
                    <sl-icon slot="prefix" name="pencil-fill"></sl-icon>
                    Edit Deck
                  </sl-button>
                </div>
              </sl-card>
            `
          })
        }
      </div>

      <sl-dialog id="create_deck_modal" label="Create a new deck" class="dialog-overview">
        <sl-input id="create_deck_name" label="Enter a name for your deck (required)" required></sl-input>
        <sl-textarea id="create_deck_desc" label="Enter a description for your deck"></sl-textarea>
        <sl-button slot="footer" variant="danger" @click="${e => this.closeModal('#create_deck_modal')}">Close</sl-button>
        <sl-button slot="footer" variant="success" @click="${e => this.createDeck(this.$query('#create_deck_name').value, this.$query('#create_deck_desc').value)}">Create</sl-button>
      </sl-dialog>
    `;
  }
}
