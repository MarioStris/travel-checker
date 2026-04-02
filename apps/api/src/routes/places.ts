import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import { autocomplete, getPlaceDetails } from '../services/place.service.js';

export const placeRoutes = new Hono();

const API_KEY = (): string => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error('GOOGLE_PLACES_API_KEY is not configured');
  return key;
};

// GET /api/places/autocomplete?q=Paris
placeRoutes.get('/autocomplete', requireAuth, async (c) => {
  const query = c.req.query('q');
  if (!query || query.length < 2) {
    return c.json({ predictions: [] });
  }

  const predictions = await autocomplete(query, API_KEY());
  return c.json({ predictions });
});

// GET /api/places/details?placeId=ChIJ...
placeRoutes.get('/details', requireAuth, async (c) => {
  const placeId = c.req.query('placeId');
  if (!placeId) {
    return c.json({ error: 'placeId required' }, 400);
  }

  const details = await getPlaceDetails(placeId, API_KEY());
  if (!details) return c.json({ error: 'Place not found' }, 404);

  return c.json(details);
});
