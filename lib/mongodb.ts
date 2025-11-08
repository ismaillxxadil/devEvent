import mongoose, { ConnectOptions } from "mongoose";

// Ensure the MONGO_URI is provided via environment variables
const MONGO_URI = process.env.MONGO_URI as string;

// Define a typed cache object stored on the global object so the connection
// is preserved across module reloads in development. This prevents creating
// multiple connections when Next.js hot-reloads server code.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Allow `globalThis.__mongooseCache` to exist. Use a unique name to avoid collisions.
  var __mongooseCache: MongooseCache | undefined;
}

// Initialize the global cache if it doesn't exist
const cache: MongooseCache = globalThis.__mongooseCache ?? {
  conn: null,
  promise: null,
};
if (!globalThis.__mongooseCache) globalThis.__mongooseCache = cache;

/**
 * Connect to MongoDB using Mongoose with caching to avoid multiple connections
 * during development (hot reloads). Returns the mongoose module after a
 * successful connection.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  // If we've already connected, return the cached connection
  if (cache.conn) {
    return cache.conn;
  }

  // If a connection is in progress, return the same promise
  if (cache.promise) {
    return cache.promise;
  }

  // Connection options. Mongoose 6+ has sensible defaults, but including a
  // few options for explicitness and to allow easier changes in the future.
  const opts: ConnectOptions = {
    // Prevent Mongoose from buffering commands when disconnected. Instead,
    // return errors quickly which is often more desirable in server apps.
    bufferCommands: false,

    // Other options (if needed) can be added here.
  };

  // Start the connection process and cache the promise.
  cache.promise = mongoose
    .connect(MONGO_URI, opts)
    .then(() => {
      // Once connected, store the mongoose instance for immediate returns
      cache.conn = mongoose;
      return mongoose;
    })
    .catch((err) => {
      // Reset cached promise on failure so a subsequent call can retry
      cache.promise = null;
      throw err;
    });

  return cache.promise;
}

/**
 * Utility to close the Mongoose connection. Useful for running tests or when
 * you need to explicitly disconnect the connection.
 */
export async function disconnectDatabase(): Promise<void> {
  if (cache.conn) {
    await mongoose.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
}

// Default export for convenience
export default connectToDatabase;
