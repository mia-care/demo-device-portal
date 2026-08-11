'use strict';

const express = require('express');
const { schedules, tickets } = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('/maintenance', (_req, res) => {
  res.json(schedules);
});

app.get('/maintenance/device/:id', (req, res) => {
  const schedule = schedules.find((s) => s.deviceId === req.params.id);
  if (!schedule) {
    return res
      .status(404)
      .json({ error: 'schedule not found', deviceId: req.params.id });
  }
  res.json(schedule);
});

// GET /tickets and GET /tickets?deviceId=poc-0003
app.get('/tickets', (req, res) => {
  const { deviceId } = req.query;
  if (deviceId) {
    return res.json(tickets.filter((t) => t.deviceId === deviceId));
  }
  res.json(tickets);
});

const server = app.listen(PORT, () => {
  log('info', 'maintenance-api listening', { port: PORT });
});

function shutdown(signal) {
  log('info', 'shutting down', { signal });
  server.close(() => process.exit(0));
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
