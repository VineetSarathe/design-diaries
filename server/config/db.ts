import dns from "node:dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");

function attachListeners() {
  if (mongoose.connection.listenerCount("connected") > 0) return;

  mongoose.connection.on("connected", () => {
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
}

export async function connectDB(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);
  attachListeners();

  const maxAttempts = 6;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(uri, {
        family: 4,
        serverSelectionTimeoutMS: 15000,
      });
      return;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB connect attempt ${attempt}/${maxAttempts} failed`);
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    }
  }

  throw lastError;
}

export function getDbStatus() {
  switch (mongoose.connection.readyState) {
    case 0:
      return "disconnected";
    case 1:
      return "connected";
    case 2:
      return "connecting";
    case 3:
      return "disconnecting";
    default:
      return "unknown";
  }
}
