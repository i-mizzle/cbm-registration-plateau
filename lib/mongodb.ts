import mongoose from "mongoose";

const globalCache = globalThis as unknown as {
  mongooseConn?: Promise<typeof mongoose>;
};

export function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env");

  globalCache.mongooseConn ??= mongoose.connect(uri).catch((error) => {
    globalCache.mongooseConn = undefined;
    throw error;
  });
  return globalCache.mongooseConn;
}
