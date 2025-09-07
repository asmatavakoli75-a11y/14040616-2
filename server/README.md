# Backend Server

This is the backend server for the CLBP Predictive System.

## Prerequisites

- Node.js
- npm
- MongoDB

## Setup

1.  Navigate to the `server` directory:
    ```sh
    cd server
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```

## Running the server

To start the server, run the following command from the `server` directory:

```sh
npm start
```

This will start the server with `nodemon`, which will automatically restart the server when you make changes to the code.

Alternatively, you can run both the frontend and backend concurrently from the root directory of the project:

```sh
npm run dev
```
