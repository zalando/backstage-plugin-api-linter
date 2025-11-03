const express = require('express');
const expressHttpProxy = require('express-http-proxy');
const cors = require('cors');

const PORT = 8080;
const ZALLY_URL = process.env.ZALLY_URL || 'http://localhost:8000';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === 'http://localhost:3000') return callback(null, origin);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 600,
  }),
);

// Basic health check
app.get('/health', (_, res) => res.status(200).send('ok'));
app.get('/api/auth/guest/refresh', (_, res) => res.sendStatus(200));
app.use(
  '/api/proxy/api-linter',
  // Short-circuit preflight for this route to avoid hitting the proxy
  (req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin || 'http://localhost:3000';
      res.set({
        'Access-Control-Allow-Origin': origin,
        Vary: 'Origin',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-Requested-With, Accept, Origin',
        'Access-Control-Max-Age': '600',
      });
      return res.sendStatus(204);
    }
    return next();
  },
  expressHttpProxy(ZALLY_URL, {
    https: false,
    proxyReqPathResolver: req => {
      return req.originalUrl.replace(/^\/api\/proxy\/api-linter/, '');
    },
    proxyErrorHandler: (err, res, next) => {
      if (err && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
        // eslint-disable-next-line no-console
        console.error(err);
        res.status(502).json({ error: 'Bad gateway', detail: err.message });
      } else {
        next(err);
      }
    },
    parseReqBody: false,
    reqAsBuffer: true,
    userResHeaderDecorator: (headers, userReq) => {
      const origin = userReq.headers.origin;
      if (origin) {
        // Ensure no wildcard when credentials are used
        headers['access-control-allow-origin'] = origin;
        headers.vary = 'Origin';
        headers['access-control-allow-credentials'] = 'true';
      }
      if (headers['access-control-allow-origin'] === '*') {
        headers['access-control-allow-origin'] =
          origin || 'http://localhost:3000';
      }
      return headers;
    },
    userResDecorator: (proxyRes, proxyResData, userReq) => {
      // eslint-disable-next-line no-console
      console.log(
        `[proxy] ${userReq.method} ${userReq.originalUrl} -> ${proxyRes.statusCode}`,
      );
      return proxyResData;
    },
  }),
);

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend proxy listening on http://localhost:${PORT}`);
});

const shutdown = signal => {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
};

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));
