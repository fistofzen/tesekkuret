// Simple in-memory rate limiter
// For production, use Redis or a database-backed solution

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  identifier: string,
  action: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${identifier}:${action}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // If no entry or expired, create new
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Predefined rate limits
export const RATE_LIMITS = {
  THANKS_CREATE: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
  COMMENT_CREATE: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  LIKE_TOGGLE: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;
