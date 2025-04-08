class SocketService {
    private io: any;
    private users: Set<string>;

    constructor(server: any) {
        this.io = require('socket.io')(server);
        this.users = new Set();
        this.initializeSocketEvents();
    }

    private initializeSocketEvents() {
        this.io.on('connection', (socket: any) => {
            console.log('A user connected:', socket.id);
            this.users.add(socket.id);

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
                this.users.delete(socket.id);
            });

            socket.on('chat message', (msg: any) => {
                this.broadcastMessage(msg);
            });
        });
    }

    private broadcastMessage(msg: any) {
        this.io.emit('chat message', msg);
    }
}

export default SocketService;