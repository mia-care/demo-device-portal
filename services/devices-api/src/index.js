'use strict';

const express = require('express');
const { devices } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

// Structured JSON logging: one line per request written to stdout.
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
  res.json({ status: 'ok' });
});

app.get('/ready', (_req, res) => {
  res.json({ status: 'ready' });
});

app.get('/devices', (_req, res) => {
  res.json(devices);
});

app.get('/devices/:id', (req, res) => {
  const device = devices.find((d) => d.id === req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'device not found', id: req.params.id });
  }
  res.json(device);
});

const server = app.listen(PORT, () => {
  log('info', 'devices-api listening', { port: PORT });
});

function shutdown(signal) {
  log('info', 'shutting down', { signal });
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
