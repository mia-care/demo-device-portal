import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;
const BFF_BASE_URL = process.env.BFF_BASE_URL || 'http://bff:3000';
const DIST_DIR = path.join(__dirname, 'dist');

function log(level, msg, extra = {}) {
  process.stdout.write(
    JSON.stringify({ ts: new Date().toISOString(), level, msg, ...extra }) + '\n'
  );
}

app.use((req, res, next) => {
  res.on('finish', () => {
    log('info', 'request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
  });
  next();
});

app.get('/healthz', (_req, res) => {
  res.type('text/plain').send('ok');
});

app.get('/ready', (_req, res) => {
  res.type('text/plain').send('ready');
});

app.use(express.static(DIST_DIR));

// Proxy /api/* to the BFF in code, resolving BFF_BASE_URL on every request
// instead of relying on nginx's proxy_pass, which caches the upstream's
// resolved IP and goes stale when the bff pod is rescheduled in k8s.
const HOP_BY_HOP_HEADERS = new Set(['connection', 'transfer-encoding', 'content-encoding']);

app.use('/api', async (req, res) => {
  const target = `${BFF_BASE_URL}${req.originalUrl}`;
  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? req : undefined,
      duplex: hasBody ? 'half' : undefined,
      signal: AbortSignal.timeout(10000),
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    if (upstream.body) {
      Readable.fromWeb(upstream.body).pipe(res);
    } else {
      res.end();
    }
  } catch (err) {
    log('warn', 'bff proxy error', { path: req.originalUrl, error: String(err) });
    res.status(502).json({ error: 'bad gateway' });
  }
});

// SPA fallback: serve index.html for client-side routes.
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

const server = app.listen(PORT, () => {
  log('info', 'web-portal listening', { port: PORT, bffBaseUrl: BFF_BASE_URL });
});

function shutdown(signal) {
  log('info', 'shutting down', { signal });
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
