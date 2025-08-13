const botIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#fff"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
  <path d="M9.5 9h.01" />
  <path d="M14.5 9h.01" />
  <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
</svg>
`;

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
      background-color: var(--accent-color, #242424); /* Use theme color or a fallback */
      color: white;
      border-radius: 8px;
      padding: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    button:hover {
      background-color: var(--accent-color-hover,rgba(36, 36, 36, 0.8));
    }
  </style>
  
  <button>
    <slot>${botIcon}</slot>
    <span>Chat</span>
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
