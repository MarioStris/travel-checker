import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { PrismaClient } from '@prisma/client';
import { tripRoutes } from './routes/trips.js';
import { userRoutes } from './routes/users.js';
import { photoRoutes } from './routes/photos.js';
import { placeRoutes } from './routes/places.js';
import { accommodationRoutes } from './routes/accommodations.js';
import { budgetRoutes } from './routes/budgets.js';
import { statsRoutes } from './routes/stats.js';
import { notificationRoutes } from './routes/notifications.js';

export const prisma = new PrismaClient();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:8081', 'http://localhost:19006'],
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'travel-checker-api' });
});

// Routes
app.route('/api/trips', tripRoutes);
app.route('/api/trips', accommodationRoutes);
app.route('/api/trips', budgetRoutes);
app.route('/api/users', userRoutes);
app.route('/api/photos', photoRoutes);
app.route('/api/places', placeRoutes);
app.route('/api/stats', statsRoutes);
app.route('/api/notifications', notificationRoutes);

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json(
    { error: 'Internal Server Error', message: err.message },
    500,
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404);
});

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`\n  Travel Checker API`);
  console.log(`  http://localhost:${info.port}`);
  console.log(`  Health: http://localhost:${info.port}/health\n`);
});

export { app };
