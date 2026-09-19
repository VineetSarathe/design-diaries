import { env } from "../config/env";
import { Admin } from "../models/admin.model";
import { hashPassword } from "../utils/password";

export async function seedAdmin(): Promise<void> {
  const email = env.ADMIN_EMAIL;
  const passwordHash = await hashPassword(env.ADMIN_PASSWORD);

  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

  console.log(`Admin account ready: ${email}`);
}
