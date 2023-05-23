
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AppRouter } from './components/router';

import './styles/global.css';
import './components/global.js';
import './styles/theme.js';
import './utils/dom';


import '@vaadin/app-layout/theme/lumo/vaadin-app-layout.js';
import '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle.js';
import '@vaadin/tabs/theme/lumo/vaadin-tabs.js';

import './pages/home';
import './pages/examples';
import './pages/settings';

import { Web5 } from '@tbd54566975/web5';
const { web5, did: userDID } = await Web5.connect();
localStorage.userDID = JSON.stringify(userDID);

console.log(userDID);

// import { Datastore } from './utils/datastore.js';
// const datastore = globalThis.datastore = new Datastore({
//   web5: web5,
//   did: userDID
// })

const BASE_URL: string = (import.meta.env.BASE_URL).length > 2 ? (import.meta.env.BASE_URL).slice(1, -1) : (import.meta.env.BASE_URL);

@customElement('app-container')
export class AppContainer extends LitElement {

  static get styles() {
    return css`

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      /* #app_header {
        padding: 0.9em 1.1em;
        color: #000;
        background-color: rgb(255, 236, 25);
        background: rgb(37 39 42);
        border-bottom: 1px solid #111;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
        z-index: 100;
      } */

      vaadin-drawer-toggle {
        display: flex;
        height: var(--lumo-size-m);
        width: var(--lumo-size-m);
        font-size: 1.4em;
        cursor: pointer;
      }

      vaadin-app-layout::part(navbar) {
        background: rgba(50 50 55 / 100%);
        box-shadow: 0 0 2px 2px rgba(0 0 0 / 25%);
        z-index: 2;
      }

      vaadin-app-layout h1 {
        margin: 0;
        font-size: 1.2em;

      }

      vaadin-app-layout::part(drawer) {
        width: 14em;
        padding-top: 0.5em;
        background: rgba(44 44 49 / 100%);
        border-inline-end: 1px solid rgb(255 255 255 / 2%);
      }

      vaadin-app-layout vaadin-tab {
        padding: 0.75rem 1.2rem;
      }

      vaadin-app-layout vaadin-tab a :first-child {
        margin: 0 0.5em 0 0;
      }

      vaadin-app-layout [content] {

      }

      main {
        position: relative;
        height: 100%;
      }

      main > * {
        position: absolute;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        padding: 2.5em;
        opacity: 0;
        visibility: hidden;
        transition: visibility 0.3s, opacity 0.3s ease;
        overflow-y: scroll;
      }

      main > [state="active"] {
        opacity: 1;
        z-index: 1;
        visibility: visible;
      }

      /* main > *[state="active"] {
        overflow-y: scroll;
      } */

      /* For Webkit-based browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: rgb(40, 40, 40);
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 6px;
        border: 2px solid rgb(40, 40, 40);
        background-clip: content-box;
      }

      /* For Firefox (version 64 and later) */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.25) rgb(40, 40, 40);
      }

      /* For Edge */
      ::-ms-scrollbar {
        width: 10px;
      }

      ::-ms-scrollbar-track {
        background: rgb(40, 40, 40);
      }

      ::-ms-scrollbar-thumb {
        border-radius: 6px;
        border: 2px solid rgb(40, 40, 40);
        background-color: rgba(255, 255, 255, 0.25);
        background-clip: content-box;
      }

    `;
  }

  constructor() {
    super();

    this.router = new AppRouter(this, {
      onRouteChange: () => {
        this.renderRoot.querySelector('#app_layout')?.__closeOverlayDrawer()
      },
      routes: [
        {
          path: '/',
          component: '#home'
        },
        {
          path: '/examples',
          component: '#examples'
        },
        {
          path: '/settings',
          component: '#settings'
        }
      ]
    });

    this.addEventListener('app-notify', e => this.notify(e.detail.message, e.detail))

  }

  firstUpdated() {
    DOM.skipFrame(() => this.router.goto(location.pathname));
  }

  notify(message, options = {}) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant: 'primary',
      duration: 3000,
      closable: true,
      innerHTML: `
        <sl-icon name="${options.icon || 'info-circle'}" slot="icon"></sl-icon>
        ${document.createTextNode(message).textContent}
      `
    }, options);
    return document.body.appendChild(alert).toast();
  }

  render() {
    return html`

      <vaadin-app-layout id="app_layout">

        <vaadin-drawer-toggle slot="navbar">
          <sl-icon name="list"></sl-icon>
        </vaadin-drawer-toggle>

        <h1 slot="navbar">DWA Starter</h1>

        <vaadin-tabs slot="drawer" orientation="vertical">
          <vaadin-tab>
            <a tabindex="-1" href="/">
              <sl-icon name="house"></sl-icon>
              <span>Home</span>
            </a>
          </vaadin-tab>
          <vaadin-tab>
            <a tabindex="-1" href="/examples">
              <sl-icon name="grid"></sl-icon>
              <span>Examples</span>
            </a>
          </vaadin-tab>
          <vaadin-tab>
            <a tabindex="-1" href="/settings">
              <sl-icon name="sliders"></sl-icon>
              <span>Settings</span>
            </a>
          </vaadin-tab>
        </vaadin-tabs>

        <main id="pages">
          <page-home id="home" scroll></page-home>
          <page-examples id="examples" scroll></page-examples>
          <page-settings id="settings" scroll></page-settings>
        </main>

      </vaadin-app-layout>


    `;
  }
}
