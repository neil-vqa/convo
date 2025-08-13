import { store } from "./store.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    /* Scoped styles for the component */
    :host {
      /* ----- DARK THEME PALETTE ----- */
      /* Define colors as CSS Custom Properties for easy theming */
      --background-color: #1a1a1a;        /* Very dark gray, almost black */
      --component-background-color: #242424; /* Dark gray for the component itself */
      --text-color: #e1e1e1;            /* Light gray for primary text */
      --border-color: #444;             /* Mid-gray for borders */
      --accent-color: #007bff;            /* Keep the blue for a nice pop of color */
      --accent-color-hover: #0056b3;      /* A darker blue for hover */
      --user-message-background: var(--accent-color);
      --assistant-message-background: #3a3a3a; /* Darker gray for assistant messages */
      --button-disabled-background: #555;
      --button-disabled-text: #999;

      /* ----- COMPONENT STYLES ----- */
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      width: 400px;
      background-color: var(--component-background-color);
      color: var(--text-color); /* Set default text color for the component */
    }

    .chat-messages {
      min-height: 200px;
      max-height: 70vh;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 16px;
      overflow-y: auto;
      background-color: var(--background-color); /* Use the darkest background for the chat window */
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .message {
        padding: 6px 10px;
        border-radius: 12px;
        max-width: 80%;
    }

    .user-message {
        align-self: flex-end;
        background-color: var(--user-message-background);
        color: #ffffff; /* White text looks best on the blue background */
    }

    .assistant-message {
        align-self: flex-start;
        background-color: var(--assistant-message-background);
        color: var(--text-color);
    }

    #chat-form {
      display: flex;
      gap: 8px;
    }

    #message-input {
      flex-grow: 1;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 8px;
      font-size: 1em;
      background-color: var(--background-color); /* Match chat window background */
      color: var(--text-color);
    }

    #message-input::placeholder {
      color: #888;
    }

    #send-button {
      border: none;
      background-color: var(--accent-color);
      color: white;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
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

  <div class="chat-messages" id="chat-messages"></div>
  <form id="chat-form">
    <input type="text" id="message-input" placeholder="Type a message..." autocomplete="off" required>
    <button type="submit" id="send-button">Send</button>
  </form>
`;

class ChatBox extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root and append the template
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Get references to elements in the shadow DOM
    this.chatForm = this.shadowRoot.querySelector("#chat-form");
    this.messageInput = this.shadowRoot.querySelector("#message-input");
    this.sendButton = this.shadowRoot.querySelector("#send-button");
    this.chatMessages = this.shadowRoot.querySelector("#chat-messages");
  }

  // Called when the element is added to the DOM
  connectedCallback() {
    this.chatForm.addEventListener("submit", this.handleSubmit.bind(this));
    store.addEventListener("state-change", () => this.displayMessage());
  }

  // Called when the element is removed from the DOM
  disconnectedCallback() {
    this.chatForm.removeEventListener("submit", this.handleSubmit.bind(this));
    store.removeEventListener("state-change");
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
    this.messageInput.disabled = isLoading;
    this.sendButton.disabled = isLoading;
    if (isLoading) {
      this.sendButton.textContent = "...";
    } else {
      this.sendButton.textContent = "Send";
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
