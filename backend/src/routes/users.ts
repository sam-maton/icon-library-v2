import { Hono } from "hono";
import { db } from '../../db/index.js';
import { organisation, userOrganisation } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const users = new Hono();

users.get('/:id/organisations', async (c) => {
  const userId = c.req.param('userId');

  if (!userId) {
    return c.json({ error: 'userId is required' }, 400);
  }

  const organisations = await db.select({
        id: organisation.id,
        name: organisation.name,
        createdAt: organisation.createdAt,
        updatedAt: organisation.updatedAt,
        admin: userOrganisation.admin,
      })
      .from(userOrganisation)
      .innerJoin(organisation, eq(userOrganisation.organisationId, organisation.id))
      .where(eq(userOrganisation.userId, userId));

  return c.json({ organisations });
});