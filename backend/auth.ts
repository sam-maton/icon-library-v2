import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/index.js';
import * as schema from './db/schema.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_BASE_URL || 'http://localhost:4200',
  // For development, we'll use a simple secret key
  // In production, this should be an environment variable
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-key-change-in-production',
});
