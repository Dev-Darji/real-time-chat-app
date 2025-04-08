# Real-Time Chat Application

This is a real-time chat application built using Node.js, Express, and Socket.IO. It allows users to send and receive messages in real-time.

## Project Structure

```
real-time-chat-app
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── chatController.ts
│   ├── models
│   │   └── messageModel.ts
│   ├── routes
│   │   └── chatRoutes.ts
│   ├── services
│   │   └── socketService.ts
│   └── types
│       └── index.ts
├── public
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── client.js
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

To set up the project, follow these steps:

1. Clone the repository or download the project files.
2. Navigate to the project directory.
3. Initialize the project with npm:

   ```
   npm init -y
   ```

4. Install the required dependencies:

   ```
   npm install express socket.io typescript @types/express @types/socket.io ts-node
   ```

5. Create the TypeScript configuration file:

   ```
   touch tsconfig.json
   ```

   Add the following content to `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "commonjs",
       "outDir": "./dist",
       "rootDir": "./src",
       "strict": true,
       "esModuleInterop": true
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   ```

## Usage

To run the application, use the following command:

```
npx ts-node src/app.ts
```

Open your browser and navigate to `http://localhost:3000` to access the chat application.

## Features

- Real-time messaging using WebSockets
- User-friendly chat interface
- Message history retrieval

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.