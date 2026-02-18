import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { auth } from './auth.js';
import { organisations } from './src/routes/organisations.js';

const app = new Hono();

app.use('/*', cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.route('/api/organisations',organisations);

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

