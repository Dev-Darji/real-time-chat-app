"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketService {
    constructor(server) {
        this.io = require('socket.io')(server);
        this.users = new Set();
        this.initializeSocketEvents();
    }
    initializeSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);
            this.users.add(socket.id);
            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                this.users.delete(socket.id);
            });
            socket.on('chat message', (msg) => {
                this.broadcastMessage(msg);
            });
        });
    }
    broadcastMessage(msg) {
        this.io.emit('chat message', msg);
    }
}
exports.default = SocketService;
