import { store } from "./store.js";

const sendIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#fff"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M10 14l11 -11" />
  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
</svg>
`;

const waitIcon = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#fff"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M12 6l0 -3" />
  <path d="M16.25 7.75l2.15 -2.15" />
  <path d="M18 12l3 0" />
  <path d="M16.25 16.25l2.15 2.15" />
  <path d="M12 18l0 3" />
  <path d="M7.75 16.25l-2.15 2.15" />
  <path d="M6 12l-3 0" />
  <path d="M7.75 7.75l-2.15 -2.15" />
</svg>
`;

const closeIcon = `
<svg 
  data-slot="icon" 
  aria-hidden="true" 
  fill="none" 
  stroke-width="1.5" 
  stroke="#242424" 
  viewBox="0 0 24 24" 
  xmlns="http://www.w3.org/2000/svg" 
  width="30" 
  height="30">
    <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
`;

const template = document.createElement("template");

template.innerHTML = `
  <style>
    /* Scoped styles for the component */
    :host {
      /* ----- DARK THEME PALETTE ----- */
      /* Define colors as CSS Custom Properties for easy theming */
      --background-color: #1a1a1a;        /* Very dark gray, almost black */
      --component-background-color:rgba(36, 36, 36, 0.65); /* Dark gray for the component itself */
      --text-color: #e1e1e1;            /* Light gray for primary text */
      --border-color: #444;             /* Mid-gray for borders */
      --accent-color: #007bff;            
      --accent-color-hover: #0056b3;      /* A darker blue for hover */
      --user-message-background: var(--accent-color);
      --assistant-message-background: #3a3a3a; /* Darker gray for assistant messages */
      --button-disabled-background: #555;
      --button-disabled-text: #999;
      --shadow-color: 0deg 0% 0%;
      --shadow-elevation-high:
    0.4px 0.5px 0.7px hsl(var(--shadow-color) / 0.13),
    3.1px 3.8px 5.5px -0.5px hsl(var(--shadow-color) / 0.13),
    6.6px 7.9px 11.6px -1px hsl(var(--shadow-color) / 0.13),
    12.6px 15.3px 22.3px -1.5px hsl(var(--shadow-color) / 0.13),
    23.3px 28.1px 41.1px -2px hsl(var(--shadow-color) / 0.13),
    40.4px 48.8px 71.3px -2.5px hsl(var(--shadow-color) / 0.13);

      /* ----- COMPONENT STYLES ----- */
      display: flex;
      position: fixed;
      z-index: 99;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    :host([hidden]) {
      display: none;
    }

    #convo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 300px;
      padding: 10px;
      border-radius: 12px;
      background-color: var(--component-background-color);
      color: var(--text-color);
      box-shadow: var(--shadow-elevation-high);
    }

    #chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      width: 100%;
      height: 100%;
    }

    #chat-header > p {
      margin: 0;
      padding: 2px 8px;
      background-color: var(--background-color);
      border-radius: 10px;
    }

    #chat-header > button {
      margin:0;
      padding:0;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color:rgba(0, 0, 0, 0);
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
      }
      
      #chat-header > button:hover {
        background-color: #fff;
    }

    .chat-messages {
      display: flex;
      flex-direction: column;
      min-height: 200px;
      max-height: 50vh;
      width: 100%;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      margin: 10px 0 10px 0;
      overflow-y: auto;
      background-color: var(--background-color);
      gap: 8px;
    }
    
    .message {
        padding: 6px 10px;
        border-radius: 8px;
        max-width: 80%;
        margin: 6px;
    }

    .user-message {
        align-self: flex-end;
        background-color: var(--user-message-background);
        color: #ffffff;
    }

    .assistant-message {
        align-self: flex-start;
        background-color: var(--assistant-message-background);
        color: var(--text-color);
    }

    #chat-form {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    #message-input {
      flex-grow: 1;
      border: 1px solid var(--border-color);
      padding: 8px;
      font-size: 1em;
      background-color: var(--background-color);
      color: var(--text-color);
      width: 100%;
      border-radius: 10px 0 0 10px;
    }

    #message-input::placeholder {
      color: #888;
    }

    #send-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      background-color: var(--accent-color);
      color: white;
      border-radius: 0 10px 10px 0;
      cursor: pointer;
      transition: background-color 0.2s;
      padding: 8px;
    }

    #send-button:hover {
      background-color: var(--accent-color-hover);
    }

    #send-button:disabled {
        background-color: var(--button-disabled-background);
        color: var(--button-disabled-text);
        cursor: not-allowed;
    }
  </style>

  <div id="convo-container">
    <div id="chat-header">
      <p>convo</p>
      <button type="button" id="chat-header-btn">
        ${closeIcon}
      </button>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <form id="chat-form">
      <input type="text" id="message-input" placeholder="Type a message..." autocomplete="off" required>
      <button type="submit" id="send-button">
        ${sendIcon}
      </button>
    </form>
  </div>
`;

class ChatBox extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root and append the template
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Get references to elements in the shadow DOM
    this.chatHeaderBtn = this.shadowRoot.querySelector("#chat-header-btn");
    this.chatForm = this.shadowRoot.querySelector("#chat-form");
    this.messageInput = this.shadowRoot.querySelector("#message-input");
    this.sendButton = this.shadowRoot.querySelector("#send-button");
    this.chatMessages = this.shadowRoot.querySelector("#chat-messages");
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    this.chatForm.addEventListener("submit", this.handleSubmit.bind(this));
    this.chatHeaderBtn.addEventListener(
      "click",
      this.toggleChatVisible.bind(this)
    );
    store.addEventListener("state-change", () => this.displayMessage());
  }

  // Called when the element is removed from the DOM
  disconnectedCallback() {
    this.chatForm.removeEventListener("submit", this.handleSubmit.bind(this));
    store.removeEventListener("state-change");
  }

  toggleChatVisible(event) {
    this.hidden = true;
  }

  async handleSubmit(event) {
    event.preventDefault();
    const message = this.messageInput.value.trim();

    if (!message) return;

    store.addMessage(message, "user");
    this.messageInput.value = "";
    this.toggleLoading(true);

    await this.sendMessageToApi();
    this.toggleLoading(false);
  }

  displayMessage() {
    const currentMsg = store.state.currentMsg;
    const currentRole = store.state.currentRole;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", `${currentRole}-message`);
    messageElement.textContent = currentMsg;

    this.chatMessages.appendChild(messageElement);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  toggleLoading(isLoading) {
    this.sendButton.disabled = isLoading;
    if (isLoading) {
      this.sendButton.innerHTML = waitIcon;
    } else {
      this.sendButton.innerHTML = sendIcon;
    }
  }

  async sendMessageToApi() {
    const apiUrl = this.getAttribute("api-url");

    const llm = "local-llm";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer no-key",
        },
        body: JSON.stringify({
          model: llm,
          messages: store.state.messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const chatResponse = await response.json();
      const msgContent = chatResponse.choices[0].message.content;
      store.addMessage(msgContent, "assistant");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
}

customElements.define("chat-box", ChatBox);
