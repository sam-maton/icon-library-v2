import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { auth } from './auth.js';

const app = new Hono();

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// Mount Better Auth routes at /api/auth
// This provides all the authentication endpoints:
// - POST /api/auth/sign-up/email - for signup
// - POST /api/auth/sign-in/email - for login
// - POST /api/auth/sign-out - for logout
// - GET /api/auth/session - to get current session
app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// Backward compatibility - redirect old endpoints to Better Auth endpoints
app.post('/api/signup', async (c) => {
  const body = await c.req.json();
  
  // Create a new request to Better Auth's sign-up endpoint
  const authRequest = new Request('http://localhost:3000/api/auth/sign-up/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      name: body.name || body.email.split('@')[0],
    }),
  });

  // Call Better Auth handler
  const response = await auth.handler(authRequest);
  return response;
});

app.post('/api/login', async (c) => {
  const body = await c.req.json();
  
  // Create a new request to Better Auth's sign-in endpoint
  const authRequest = new Request('http://localhost:3000/api/auth/sign-in/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
    }),
  });

  // Call Better Auth handler
  const response = await auth.handler(authRequest);
  return response;
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

