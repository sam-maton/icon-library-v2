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

// Mount Better Auth routes
app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// Signup endpoint (using Better Auth)
app.post('/api/signup', async (c) => {
  try {
    const body = await c.req.json();
    
    // Use Better Auth to sign up the user
    const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
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

    const data = await response.json();
    
    if (!response.ok) {
      return c.json({ 
        success: false, 
        message: data.error || 'Signup failed' 
      }, response.status);
    }

    return c.json({ 
      success: true, 
      message: 'User created successfully',
      user: data.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ 
      success: false, 
      message: 'An error occurred during signup' 
    }, 500);
  }
});

// Login endpoint (using Better Auth)
app.post('/api/login', async (c) => {
  try {
    const body = await c.req.json();
    
    // Use Better Auth to sign in the user
    const response = await fetch('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return c.json({ 
        success: false, 
        message: data.error || 'Login failed' 
      }, response.status);
    }

    return c.json({ 
      success: true, 
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ 
      success: false, 
      message: 'An error occurred during login' 
    }, 500);
  }
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

