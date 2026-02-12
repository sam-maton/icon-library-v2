import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { auth } from './auth.js';

const app = new Hono();
const BASE_URL = process.env.BETTER_AUTH_BASE_URL || 'http://localhost:3000';

app.use('/*', cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'OK' });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});

