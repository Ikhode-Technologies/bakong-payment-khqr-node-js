# KHQR Payment Server

This Node.js server provides an API to generate **KHQR payment QR codes** and verify payment status using the **Bakong API**. It supports **WebSocket** broadcasting for real-time payment notifications and sends Telegram alerts when payments are confirmed.
<!-- Header Links -->
[![Portfolio](https://img.shields.io/badge/-artstation-blue?style=flat&logo=artstation&logoColor=white)](https://www.artstation.com/ikhode)
[![Portfolio](https://img.shields.io/badge/-gumroad-red?style=flat&logo=gumroad&logoColor=white)](https://ikhodestudio.gumroad.com/l/kxpyjf)
[![Portfolio](https://img.shields.io/badge/-twitch-violet?style=flat&logo=twitch&logoColor=white)](https://www.twitch.tv/ikhode_kh)
[![Portfolio](https://img.shields.io/badge/-instagram-hotpink?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/ikhode.kh/)
[![Portfolio](https://img.shields.io/badge/-tiktok-graypink?style=flat&logo=tiktok&logoColor=white)](https://www.tiktok.com/@ikhode_studio)
[![Portfolio](https://img.shields.io/badge/-facebook-blue?style=flat&logo=facebook&logoColor=white)](https://web.facebook.com/IkhodeStudio)
[![Portfolio](https://img.shields.io/badge/-youtube-red?style=flat&logo=youtube&logoColor=white)](https://www.youtube.com/@IkhodeStudio)
[![Linkedin](https://img.shields.io/badge/-LinkedIn-blue?style=flat&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/soy-tet-45a215280)
![image](https://github.com/user-attachments/assets/5470ded5-b424-4c79-8125-03b658a4291f)
<table>
  <tr>
    <td>
      <a href="https://www.ikhode.site/">
        <img width="550" src="https://github.com/user-attachments/assets/8aead125-14da-4205-a01f-eb5eb9b8da5b" alt="Profile Image">
      </a>
    </td>
    <td>
      I'm a <strong>Software Developer</strong> passionate about <strong>coding</strong> and building tools that help people with their daily tasks.
      I'm currently exploring <strong>AI solutions</strong> and working with <strong>modern tech stacks</strong>. I'm also on a journey to level up my 
      <strong>Spaghetti Code</strong> skills. Support us by make some donate and I really appricate that.
      <br><br>
      Got a question? Feel free to <a href="https://bio.ikhode.site/">contact me anytime</a>.
    </td>
  </tr>
</table>

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
