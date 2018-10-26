import morphdom from 'morphdom';

const DOMOperations = {
  // DOM Events ..............................................................................................

  dispatchEvent: config => {
    let target = document;
    if (config.selector)
      target = document.querySelector(config.selector) || document;
    const event = new Event(config.name);
    event.detail = config.detail;
    target.dispatchEvent(event);
  },

  // Element Mutations .......................................................................................

  morph: config => {
    let template = document.createElement('template');
    template.innerHTML = String(config.html).trim();
    DOMOperations.dispatchEvent({
      name: 'cable-ready:before-morph',
      detail: { content: template.content },
    });
    morphdom(document.querySelector(config.selector), template.content, {
      childrenOnly: !!config.childrenOnly,
    });
    DOMOperations.dispatchEvent({
      name: 'cable-ready:after-morph',
    });

    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
  },

  innerHtml: config => {
    document.querySelector(config.selector).innerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
  },

  textContent: config => {
    document.querySelector(config.selector).textContent = config.text;
  },

  insertAdjacentHtml: config => {
    document
      .querySelector(config.selector)
      .insertAdjacentHTML(config.position || 'beforeend', config.html);
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
  },

  insertAdjacentText: config => {
    document
      .querySelector(config.querySelector)
      .insertAdjacentText(config.position || 'beforeend', config.text);
  },

  remove: config => {
    document.querySelector(config.selector).remove();
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
  },

  replace: config => {
    const element = document.querySelector(config.selector);
    const div = document.createElement('div');
    div.innerHTML = config.html;
    if (config.focusSelector) {
      document.querySelector(config.focusSelector).focus();
    }
  },

  setValue: config => {
    document.querySelector(config.selector).value = config.value;
  },

  // Attribute Mutations .....................................................................................

  setAttribute: config => {
    document
      .querySelector(config.selector)
      .setAttribute(config.name, config.value);
  },

  removeAttribute: config => {
    document.querySelector(config.selector).removeAttribute(config.name);
  },

  // CSS Class Mutations .....................................................................................

  addCssClass: config => {
    document.querySelector(config.selector).classList.add(config.name);
  },

  removeCssClass: config => {
    document.querySelector(config.selector).classList.remove(config.name);
  },

  // Dataset Mutations .......................................................................................

  setDatasetProperty: config => {
    document.querySelector(config.selector).dataset[config.name] = config.value;
  },
};

export const perform = operations => {
  for (let name in operations) {
    if (operations.hasOwnProperty(name)) {
      const entries = operations[name];
      for (let i = 0; i < entries.length; i++) {
        try {
          const config = entries[i];
          DOMOperations[name](config);
        } catch (e) {
          console.log(`CableReady detected an error in ${name}! ${e.message}`);
        }
      }
    }
  }
};