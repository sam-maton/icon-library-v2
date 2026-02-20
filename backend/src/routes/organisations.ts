import { Hono } from "hono";
import { db } from '../../db/index.js';
import { organisation, userOrganisation } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const organisations = new Hono();

organisations.post('/', async (c) => {
  const body = await c.req.json();
  const { userId, name } = body;

  // TODO: Add authentication middleware to verify userId matches the authenticated user
  // Currently accepting userId from request body is a security risk
  
  if (!userId || !name) {
    return c.json({ error: 'userId and name are required' }, 400);
  }

  // Validate name length
  if (name.length < 3) {
    return c.json({ error: 'Organisation name must be at least 3 characters' }, 400);
  }

  const orgId = crypto.randomUUID();
  const userOrgId = crypto.randomUUID();
  const now = new Date();

  try {
    // Execute both inserts in a transaction
    await db.transaction(async (tx) => {
      // Create the organisation
      await tx.insert(organisation).values({
        id: orgId,
        name,
        createdAt: now,
        updatedAt: now,
      });

      // Add user as admin of the organisation
      await tx.insert(userOrganisation).values({
        id: userOrgId,
        userId,
        organisationId: orgId,
        admin: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    return c.json({
      id: orgId,
      name,
      createdAt: now,
      updatedAt: now,
      admin: true,
    }, 201);
  } catch (error) {
    console.error('Error creating organisation:', error);
    return c.json({ error: 'Failed to create organisation' }, 500);
  }
});