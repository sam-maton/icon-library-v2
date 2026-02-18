import { Hono } from "hono";
import { db } from '../../db/index.js';
import { organisation, userOrganisation } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const organisations = new Hono();

organisations.get('/:userId', async (c) => {
  const userId = c.req.param('userId');

  if (!userId) {
    return c.json({ error: 'userId is required' }, 400);
  }

  const organisations = await db
    .select({
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

organisations.post('', async (c) => {
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { name, userId, admin = false } = body as {
    name?: string;
    userId?: string;
    admin?: boolean;
  };

  if (!name || !name.trim() || !userId) {
    return c.json({ error: 'name and userId are required' }, 400);
  }

  if (typeof admin !== 'boolean') {
    return c.json({ error: 'admin must be a boolean' }, 400);
  }

  const now = new Date();
  const organisationId = crypto.randomUUID();
  const userOrganisationId = crypto.randomUUID();

  await db.transaction(async (tx) => {
    await tx.insert(organisation).values({
      id: organisationId,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    });

    await tx.insert(userOrganisation).values({
      id: userOrganisationId,
      userId,
      organisationId,
      admin,
      createdAt: now,
      updatedAt: now,
    });
  });

  return c.json(
    {
      organisation: {
        id: organisationId,
        name: name.trim(),
      },
      userOrganisation: {
        id: userOrganisationId,
        userId,
        organisationId,
        admin,
      },
    },
    201,
  );
});

organisations.post('/:organisationId/users', async (c) => {
  const organisationId = c.req.param('organisationId');

  if (!organisationId) {
    return c.json({ error: 'organisationId is required' }, 400);
  }

  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { userId, admin = false } = body as {
    userId?: string;
    admin?: boolean;
  };

  if (!userId) {
    return c.json({ error: 'userId is required' }, 400);
  }

  if (typeof admin !== 'boolean') {
    return c.json({ error: 'admin must be a boolean' }, 400);
  }

  const organisationExists = await db
    .select({ id: organisation.id })
    .from(organisation)
    .where(eq(organisation.id, organisationId))
    .limit(1);

  if (!organisationExists.length) {
    return c.json({ error: 'Organisation not found' }, 404);
  }

  const existingLink = await db
    .select({ id: userOrganisation.id })
    .from(userOrganisation)
    .where(
      and(
        eq(userOrganisation.userId, userId),
        eq(userOrganisation.organisationId, organisationId),
      ),
    )
    .limit(1);

  if (existingLink.length) {
    return c.json({ error: 'User is already linked to this organisation' }, 409);
  }

  const now = new Date();
  const userOrganisationId = crypto.randomUUID();

  await db.insert(userOrganisation).values({
    id: userOrganisationId,
    userId,
    organisationId,
    admin,
    createdAt: now,
    updatedAt: now,
  });

  return c.json(
    {
      userOrganisation: {
        id: userOrganisationId,
        userId,
        organisationId,
        admin,
      },
    },
    201,
  );
});