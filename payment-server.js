import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { KHQR, CURRENCY, COUNTRY, TAG } from 'ts-khqr';
import QRCode from 'qrcode';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';

console.log('Starting server...');

const app = express();
const PORT = process.env.PORT || 7777;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://payment.ikhode.site',
    'https://ai.bongrean.com',
    'https://rdlabcenter.vercel.app',
    'https://ikhode.site',
    'https://www.ikhode.site',
    'https://www.ai.bongrean.com'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



app.use(express.static(__dirname)); // Serve static files
app.use(express.json());

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('[INFO] New WebSocket client connected');
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

// KHQR Payment Route
app.post('/generate-khqr', async (req, res) => {
  const { amount, transactionId, email, username } = req.body;

  console.log(`[INFO] New QR code created for transaction ${transactionId} with amount ${amount} email ${email} username ${username}`);

  try {
    const khqrResult = KHQR.generate({
      tag: TAG.INDIVIDUAL,
      accountID: 'tet_sory@aclb',
      merchantName: 'Ikhode Banking',
      currency: CURRENCY.USD,
      amount: Number(amount),
      countryCode: COUNTRY.KH,
      additionalData: {
        billNumber: transactionId,
        purposeOfTransaction: 'Payment'
      }
    });

    if (khqrResult.status.code === 0 && khqrResult.data) {
      const qrString = khqrResult.data.qr;
      const qrCodeData = await QRCode.toDataURL(qrString);
      res.json({ qrCodeData });

      await checkPaymentStatus(khqrResult.data.md5, amount, transactionId, email, username);
    } else {
      res.status(400).json({ error: 'Invalid KHQR data' });
    }
  } catch (error) {
    console.error(`[ERROR] Error generating KHQR:`, error);
    res.status(500).json({ error: 'Error generating KHQR' });
  }
});

// Function to Check Payment Status
async function checkPaymentStatus(md5, amount, transactionId, email, username, profile) {
  const url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
  const body = { "md5": md5 };
  const token = "YOUR_BAKONG_API_TOKEN"; // Keep this safe!
  const header = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const intervalId = setInterval(async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const jsonData = await response.json();

        if (jsonData.responseCode === 0 && jsonData.data && jsonData.data.hash) {
          console.log(`[SUCCESS] Payment Confirmed for Transaction: ${transactionId}, Amount: ${amount}, email: ${email}, username: ${username}`);

          const tokenValue = parseFloat(amount) * 4000;

          const message = `New Top-up Received!\nUsername: ${username}\nEmail: ${email}\nProfile: ${profile || "N/A"}\nAmount: ${amount} USD\nTokens: ${tokenValue} KHR\nTransaction ID: ${transactionId}\nApp ID: Top Up\nSource: Server\n`;

          await sendToTelegram(message.trim());

          // Notify all WebSocket clients
          clients.forEach(ws => {
            ws.send(JSON.stringify({
              type: 'payment_success',
              transactionId,
              amount,
              email,
              username
            }));
          });

          clearInterval(intervalId);
        }
      } else {
        console.error(`[ERROR] Failed to check payment status`, response.statusText);
      }
    } catch (error) {
      console.error(`[ERROR] Error checking payment status`, error);
    }
  }, 5000);

  setTimeout(() => {
    console.error(`[ERROR] Payment timeout: 2 minutes elapsed`);
    clearInterval(intervalId);
  }, 120000);
}


const sendToTelegram = async (message) => {
  const TELEGRAM_API = `telegram bot token`;

  try {
    const response = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: -4699001143,
        text: message, // No escaping needed
        // Remove parse_mode to send plain text
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Failed to send Telegram message:", result);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
};

// Start the Server
app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});
