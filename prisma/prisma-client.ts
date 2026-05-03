import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { neon } from '@neondatabase/serverless';

const buildConnectionString = (): string => {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      'Missing POSTGRES_URL_NON_POOLING (or POSTGRES_URL) env variable'
    );
  }
  return url;
};

const buildAdapter = () => {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

  if (!url) {
    return undefined;
  }

  return new PrismaNeonHTTP(neon(buildConnectionString()));
};

const TRANSIENT_ERROR_CODES = new Set([
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'EPIPE',
  'ENETDOWN',
  'ENETUNREACH',
  'EHOSTUNREACH',
]);

const TRANSIENT_MESSAGE_FRAGMENTS = [
  'fetch failed',
  'Connection terminated',
  'Server has closed the connection',
  'socket hang up',
  'network error',
];

const isTransientError = (err: unknown): boolean => {
  if (!err || typeof err !== 'object') return false;

  const error = err as { code?: unknown; message?: unknown; cause?: unknown };

  if (
    typeof error.code === 'string' &&
    TRANSIENT_ERROR_CODES.has(error.code)
  ) {
    return true;
  }

  if (
    typeof error.message === 'string' &&
    TRANSIENT_MESSAGE_FRAGMENTS.some((fragment) =>
      (error.message as string).includes(fragment)
    )
  ) {
    return true;
  }

  if (error.cause) return isTransientError(error.cause);

  return false;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const retryOnTransient = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === maxAttempts || !isTransientError(err)) throw err;
      await sleep(100 * Math.pow(3, attempt - 1));
    }
  }

  throw lastError;
};

const prismaClientSingleton = () => {
  const adapter = buildAdapter();
  const baseClient = new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

  return baseClient.$extends({
    name: 'retryOnTransient',
    query: {
      $allOperations({ args, query }) {
        return retryOnTransient(() => query(args));
      },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
