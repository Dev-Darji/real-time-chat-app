import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface User {
  id: string;
  name: string;
  phone: string;
}

interface Message {
  sender: string;
  receiver: string;
  message: string;
}

const users: Record<string, User> = {}; // Store users by socket ID
const messages: Message[] = []; // Store all messages

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user login
  socket.on("login", (data: { name: string; phone: string }) => {
    users[socket.id] = { id: socket.id, name: data.name, phone: data.phone };
    console.log(`${data.name} logged in with phone ${data.phone}`);
    socket.emit("login_success", { message: "Login successful!" });
  });

  // Handle sending messages
  socket.on("send_message", (data: { receiverPhone: string; message: string }) => {
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
    } else {
      socket.emit("error", { message: "Receiver not found!" });
    }
  });

  // Handle fetching chat history
  socket.on("get_chat_history", (data: { receiverPhone: string }) => {
    const sender = users[socket.id];
    if (!sender) {
      socket.emit("error", { message: "You must log in first!" });
      return;
    }

    // Filter messages between the sender and receiver
    const chatHistory = messages.filter(
      (msg) =>
        (msg.sender === sender.phone && msg.receiver === data.receiverPhone) ||
        (msg.sender === data.receiverPhone && msg.receiver === sender.phone)
    );

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