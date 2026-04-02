import { Context, Next } from 'hono';
import { verifyToken } from '@clerk/backend';

export type AuthContext = {
  userId: string;
  clerkId: string;
  email: string;
};

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    // Find user in our DB by clerk ID
    const { prisma } = await import('../index.js');
    const user = await prisma.user.findUnique({
      where: { clerkId: payload.sub },
    });

    if (!user) {
      return c.json({ error: 'Unauthorized', message: 'User not found. Please complete onboarding.' }, 401);
    }

    c.set('auth', {
      userId: user.id,
      clerkId: user.clerkId,
      email: user.email,
    } satisfies AuthContext);

    await next();
  } catch (err) {
    console.error('Auth error:', err);
    return c.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, 401);
  }
}

export function getAuth(c: Context): AuthContext {
  return c.get('auth') as AuthContext;
}
