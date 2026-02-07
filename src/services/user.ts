import dbConnect from "@/lib/dbConnect";
import User, { IUser } from "@/models/User";
import { hash, compare } from "bcryptjs";

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await dbConnect();
  const user = await User.findOne({ email, isDeleted: { $ne: true } }).lean();
  return user;
}

export async function getUserById(id: string): Promise<IUser | null> {
  await dbConnect();
  const user = await User.findById(id).lean();
  return user;
}

export async function getUserFromDb(
  email: string,
  password: string,
): Promise<IUser | null> {
  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}
