# KHQR Payment Server

This Node.js server provides an API to generate **KHQR payment QR codes** and verify payment status using the **Bakong API**. It supports **WebSocket** broadcasting for real-time payment notifications and sends Telegram alerts when payments are confirmed.

## Features

- Generate KHQR codes for payments
- Verify payment status via Bakong API
- Real-time payment updates via WebSockets
- Telegram notifications for confirmed payments
- Serve a static homepage (`index.html`)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MyKhode/khqr-payment-server.git
cd khqr-payment-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root with the following:

```
PORT=7777
BAKONG_API_TOKEN=your_bakong_token_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

⚠️ **Do not commit the `.env` file to version control.**

## Usage

### Start the server

```bash
npm start
```

The server runs on the port defined in `PORT` (default: 7777). The WebSocket server listens on port 8080.

### API Endpoints

#### `POST /generate-khqr`

Generates a KHQR code for a payment and starts monitoring its status.

**Request Body:**

```json
{
  "amount": 5,
  "transactionId": "txn-001",
  "email": "user@example.com",
  "username": "john_doe"
}
```

**Response:**

```json
{
  "qrCodeData": "data:image/png;base64,iVBORw0K..."
}
```

This endpoint polls the Bakong API to confirm the payment. On success, it:
- Broadcasts a WebSocket message to all connected clients
- Sends a Telegram notification

### WebSocket

Connect to `ws://localhost:8080`.

On payment confirmation, a `payment_success` message is sent:

```json
{
  "type": "payment_success",
  "transactionId": "txn-001",
  "amount": "5",
  "email": "user@example.com",
  "username": "john_doe"
}
```

### Static Files

Static files (e.g., `index.html`) in the project root are served. Access the homepage at `http://localhost:7777/`.

## Dependencies

- `express`
- `cors`
- `ws`
- `qrcode`
- `ts-khqr`
- `node-fetch`

## Security Notes

- Use environment variables for sensitive tokens (e.g., `BAKONG_API_TOKEN`, `TELEGRAM_BOT_TOKEN`).
- Restrict CORS origins in production to trusted domains.
- Ensure secure handling of API tokens and credentials.

## License

MIT

## Author

Created by Ikhode Studio.
