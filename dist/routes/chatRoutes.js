"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setChatRoutes = void 0;
function setChatRoutes(app) {
    const chatController = new (require('../controllers/chatController')).ChatController();
    app.post('/api/chat/send', chatController.sendMessage.bind(chatController));
    app.get('/api/chat/messages', chatController.getMessages.bind(chatController));
}
exports.setChatRoutes = setChatRoutes;
