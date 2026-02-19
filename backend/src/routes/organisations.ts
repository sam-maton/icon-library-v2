import { Hono } from "hono";
import { db } from '../../db/index.js';
import { organisation, userOrganisation } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const organisations = new Hono();