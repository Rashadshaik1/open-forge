import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import addonRoutes from './routes/addonRoutes.js';

dotenv.config();

const app = express();

// 1. CORS Configuration with protocol & slash normalization
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://open-forge-client.vercel.app',
];

if (process.env.CLIENT_URL) {
  let envOrigin = process.env.CLIENT_URL.trim();
  // Ensure protocol is present
  if (!envOrigin.startsWith('http://') && !envOrigin.startsWith('https://')) {
    envOrigin = `https://${envOrigin}`;
  }
  // Remove trailing slashes
  envOrigin = envOrigin.replace(/\/+$/, '');
  defaultAllowedOrigins.push(envOrigin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed = defaultAllowedOrigins.some(
        (allowed) => allowed.replace(/\/+$/, '') === cleanOrigin
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: Origin "${origin}" is not in allowed list:`, defaultAllowedOrigins);
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// High-limit parsers to accommodate Base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', addonRoutes);

// 3. System Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 4. Global Error Handler (Prevents crashes on payload or JSON parse issues)
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Uploaded payload is too large. Please select an image under 10MB.',
    });
  }

  console.error('[Server Error]:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error('[Server Startup Failed]:', error.message);
    process.exit(1);
  }
};

startServer();