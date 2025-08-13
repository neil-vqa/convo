class AppStore extends EventTarget {
  constructor() {
    super();
    this.state = {
      messages: [
        {
          role: "system",
          content: "You are Sunny, an AI assistant.",
        },
      ],
      currentMsg: null,
      currentRole: null,
    };
  }

  // A "reducer" or "action" to change the state
  addMessage(msgContent, role) {
    const newMessages = [...this.state.messages, { role, content: msgContent }];
    this.state = {
      ...this.state,
      messages: newMessages,
      currentMsg: msgContent,
      currentRole: role,
    };
    this.dispatchEvent(new CustomEvent("state-change"));
  }
}

// Export a single instance (singleton)
export const store = new AppStore();
