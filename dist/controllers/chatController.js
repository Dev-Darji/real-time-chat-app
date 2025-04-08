"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    constructor() {
        this.messages = [];
        this.messageId = 0;
    }
    sendMessage(username, content) {
        const message = {
            id: ++this.messageId,
            username,
            content,
            timestamp: new Date(),
        };
        this.messages.push(message);
        return message;
    }
    getMessages() {
        return this.messages;
    }
}
exports.default = ChatController;
