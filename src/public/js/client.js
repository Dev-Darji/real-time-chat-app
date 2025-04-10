const socket = io();

const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const loginForm = document.getElementById("login-form");
const chatForm = document.getElementById("chat-form");
const nameInput = document.getElementById("name-input");
const phoneInput = document.getElementById("phone-input");
const contactsList = document.getElementById("contacts-list");
const messageInput = document.getElementById("message-input");
const messages = document.getElementById("messages");
const chatHeader = document.getElementById("chat-header");
const addContactForm = document.getElementById("add-contact-form");
const contactNameInput = document.getElementById("contact-name-input");
const contactPhoneInput = document.getElementById("contact-phone-input");

let currentReceiverPhone = null;

// Example contacts (initially empty, can be populated dynamically)
let contacts = [];

// Handle login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const phone = phoneInput.value;

  socket.emit("login", { name, phone });

  socket.on("login_success", (data) => {
    alert(data.message);
    loginContainer.style.display = "none";
    appContainer.style.display = "flex";
  });

  socket.on("error", (data) => {
    alert(data.message);
  });
});

// Load contacts into the sidebar
function loadContacts() {
  contactsList.innerHTML = ""; // Clear the current list
  contacts.forEach((contact) => {
    const li = document.createElement("li");
    li.textContent = contact.name;
    li.dataset.phone = contact.phone;
    li.addEventListener("click", () => {
      currentReceiverPhone = contact.phone;
      chatHeader.textContent = `Chat with ${contact.name}`;
      messages.innerHTML = ""; // Clear previous messages

      // Fetch chat history
      socket.emit("get_chat_history", { receiverPhone: currentReceiverPhone });

      socket.on("chat_history", (chatHistory) => {
        chatHistory.forEach((msg) => {
          const item = document.createElement("li");
          item.textContent = `${msg.sender === phoneInput.value ? "You" : msg.sender}: ${msg.message}`;
          item.classList.add(
            msg.sender === phoneInput.value ? "message outgoing" : "message incoming"
          );
          messages.appendChild(item);
        });
      });
    });
    contactsList.appendChild(li);
  });
}

// Handle adding a new contact
addContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = contactNameInput.value.trim();
  const phone = contactPhoneInput.value.trim();

  if (!name || !phone) {
    alert("Please enter both name and phone number.");
    return;
  }

  // Add the new contact to the contacts list
  contacts.push({ name, phone });
  loadContacts(); // Reload the contacts list

  // Clear the input fields
  contactNameInput.value = "";
  contactPhoneInput.value = "";
});

// Handle sending messages
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  if (!currentReceiverPhone) {
    alert("Please select a receiver first!");
    return;
  }

  // Emit the message to the server
  socket.emit("send_message", { receiverPhone: currentReceiverPhone, message });

  // Add the message to the chat as an outgoing message
  const item = document.createElement("li");
  item.textContent = `You: ${message}`;
  item.classList.add("message", "outgoing");
  messages.appendChild(item);

  // Clear the input field
  messageInput.value = "";
});

// Handle receiving messages
socket.on("receive_message", (data) => {
  const { sender, message } = data;

  // Find the sender's name from the contacts list
  const contact = contacts.find((contact) => contact.phone === sender);
  const senderName = contact ? contact.name : sender; // Fallback to phone number if name is not found

  if (sender === currentReceiverPhone) {
    const item = document.createElement("li");
    item.textContent = `${senderName}: ${message}`;
    item.classList.add("message", "incoming");
    messages.appendChild(item);
  }
});