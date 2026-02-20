import { Hono } from "hono";
import { db } from '../../db/index.js';
import { organisation, userOrganisation } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const organisations = new Hono();

organisations.post('/', async (c) => {
  const body = await c.req.json();
  const { userId, name } = body;

  if (!userId || !name) {
    return c.json({ error: 'userId and name are required' }, 400);
  }

  const orgId = crypto.randomUUID();
  const userOrgId = crypto.randomUUID();
  const now = new Date();

  try {
    // Create the organisation
    await db.insert(organisation).values({
      id: orgId,
      name,
      createdAt: now,
      updatedAt: now,
    });

    // Add user as admin of the organisation
    await db.insert(userOrganisation).values({
      id: userOrgId,
      userId,
      organisationId: orgId,
      admin: true,
      createdAt: now,
      updatedAt: now,
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