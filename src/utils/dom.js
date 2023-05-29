import { findConfigFile } from "typescript";

var DOM = {
  ready: new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', e => {
      document.documentElement.setAttribute('ready', '');
      resolve(e)
    });
  }),
  query: s => document.querySelector(s),
  queryAll: s => document.querySelectorAll(s),
  skipFrame: fn => new Promise(resolve => requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (fn) fn();
      resolve();
    })
  })),
  wait: ms => new Promise(resolve => setTimeout(() => resolve(), ms)),
  throttle(fn, delay) {
    let last = 0;
    let timeout;
    return function(...args) {
      return new Promise(resolve => {
        const now = Date.now();
        const diff = now - last;
        clearTimeout(timeout);
        if (diff >= delay || last === 0) {
          resolve(fn(...args));
          last = now;
        }
        else {
          timeout = setTimeout(() => {
            resolve(fn(...args));
            last = Date.now();
          }, delay - diff);
        }
      })
    };
  },
  fireEvent(node, type, options = {}){
    return node.dispatchEvent(new CustomEvent(type, Object.assign({
      bubbles: true
    }, options)))
  },
  addEventDelegate(type, selector, fn, options = {}){
    let listener = e => {
      let match = e.target.closest(selector);
      if (match) fn(e, match);
    }
    (options.container || document).addEventListener(type, listener, options);
    return listener;
  },
  removeEventDelegate(type, listener, options = {}){
    (options.container || document).removeEventListener(type, listener);
  }
}

document.addEventListener('pointerdown', e => {
  e.target.setAttribute('pressed', '');
}, { passive: true });

window.addEventListener('pointerup', e => {
  DOM.queryAll('[pressed]').forEach(node => node.removeAttribute('pressed'));
}, { capture: true, passive: true });


globalThis.DOM = DOM;

export { DOM };
