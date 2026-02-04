import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for frontend
app.use('/*', cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// Signup endpoint
app.post('/api/signup', async (c) => {
  const body = await c.req.json();
  console.log('Signup request received:');
  console.log('Email:', body.email);
  console.log('Password:', body.password);
  console.log('Confirm Password:', body.confirmPassword);
  console.log('---');
  
  return c.json({ 
    success: true, 
    message: 'Signup data logged to console' 
  });
});

// Login endpoint
app.post('/api/login', async (c) => {
  const body = await c.req.json();
  console.log('Login request received:');
  console.log('Email:', body.email);
  console.log('Password:', body.password);
  console.log('---');
  
  return c.json({ 
    success: true, 
    message: 'Login data logged to console' 
  });
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
