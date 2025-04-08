class ChatController {
    private messages: { id: number; username: string; content: string; timestamp: Date }[] = [];
    private messageId: number = 0;

    sendMessage(username: string, content: string) {
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

export default ChatController;