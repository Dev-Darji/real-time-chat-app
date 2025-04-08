export function setChatRoutes(app: any) {
    const chatController = new (require('../controllers/chatController')).ChatController();

    app.post('/api/chat/send', chatController.sendMessage.bind(chatController));
    app.get('/api/chat/messages', chatController.getMessages.bind(chatController));
}