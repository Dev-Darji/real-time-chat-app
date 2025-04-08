"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const users = {}; // Store users by socket ID
const messages = []; // Store all messages
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Handle user login
    socket.on("login", (data) => {
        users[socket.id] = { id: socket.id, name: data.name, phone: data.phone };
        console.log(`${data.name} logged in with phone ${data.phone}`);
        socket.emit("login_success", { message: "Login successful!" });
    });
    // Handle sending messages
    socket.on("send_message", (data) => {
        const sender = users[socket.id];
        if (!sender) {
            socket.emit("error", { message: "You must log in first!" });
            return;
        }
        // Find the receiver by phone number
        const receiver = Object.values(users).find((user) => user.phone === data.receiverPhone);
        if (receiver) {
            // Send the message to the receiver
            io.to(receiver.id).emit("receive_message", {
                sender: sender.phone,
                message: data.message,
            });
            // Store the message
            messages.push({
                sender: sender.phone,
                receiver: receiver.phone,
                message: data.message,
            });
        }
        else {
            socket.emit("error", { message: "Receiver not found!" });
        }
    });
    // Handle fetching chat history
    socket.on("get_chat_history", (data) => {
        const sender = users[socket.id];
        if (!sender) {
            socket.emit("error", { message: "You must log in first!" });
            return;
        }
        // Filter messages between the sender and receiver
        const chatHistory = messages.filter((msg) => (msg.sender === sender.phone && msg.receiver === data.receiverPhone) ||
            (msg.sender === data.receiverPhone && msg.receiver === sender.phone));
        socket.emit("chat_history", chatHistory);
    });
    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        delete users[socket.id];
    });
});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
