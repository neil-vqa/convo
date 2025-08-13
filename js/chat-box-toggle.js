const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      position: fixed;
      z-index: 50;
      bottom: 0;
      right: 0;
      padding: 0.5rem;
    }

    button {
      border: none;
      background-color: var(--accent-color, #007bff); /* Use theme color or a fallback */
      color: white;
      border-radius: 4px;
      padding: 10px 16px;
      font-size: 1em;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: var(--accent-color-hover, #0056b3);
    }
  </style>
  
  <button>
    <slot>Open Chat</slot>
  </button>
`;

class ChatBoxToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this.handleClick.bind(this));
  }

  handleClick() {
    const targetId = this.getAttribute("controls");
    if (!targetId) {
      console.error(
        "ChatBoxToggle: The 'controls' attribute is missing. It should be the ID of the chat-box element."
      );
      return;
    }

    const chatBox = document.getElementById(targetId);
    if (!chatBox) {
      console.error(
        `ChatBoxToggle: Could not find an element with the ID "${targetId}".`
      );
      return;
    }

    chatBox.hidden = false;
  }
}

customElements.define("chat-box-toggle", ChatBoxToggle);
