import mongoose from 'mongoose';
import { env } from './env.js';

let dbConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (!env.MONGODB_URI) {
    console.warn('[MongoDB] MONGODB_URI is not set. Demo in-memory fallback active.');
    dbConnected = false;
    return false;
  }

  try {
    // Set connection timeout to 5000ms so startup isn't blocked endlessly if offline
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    dbConnected = true;
    console.log(`[MongoDB] Connected to MongoDB Atlas / Database successfully (${mongoose.connection.host}).`);
    return true;
  } catch (error) {
    dbConnected = false;
    console.warn('[MongoDB] Failed to connect to MongoDB. Active fallback to in-memory seed store.', (error as Error).message);
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return dbConnected && mongoose.connection.readyState === 1;
};

export const getDbStatus = (): { connected: boolean; state: string; host?: string } => {
  const readyStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const state = readyStateMap[mongoose.connection.readyState] || 'disconnected';
  const connected = isDbConnected();

  return {
    connected,
    state: connected ? 'connected' : `${state} (demo fallback active)`,
    host: connected ? mongoose.connection.host : undefined,
  };
};
