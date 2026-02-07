import dbConnect from "../lib/dbConnect";
import User from "../models/User";
import { hash } from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function seedAdmin() {
  try {
    console.log("--- MADE360 Admin Seeder ---");

    const email = await new Promise<string>((resolve) => {
      rl.question("Enter admin email: ", resolve);
    });

    const name = await new Promise<string>((resolve) => {
      rl.question("Enter admin name: ", resolve);
    });

    const password = await new Promise<string>((resolve) => {
      rl.question("Enter admin password: ", resolve);
    });

    if (!email || !password) {
      console.error("Email and password are required.");
      process.exit(1);
    }

    await dbConnect();
    console.log("Connected to database...");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User with this email already exists.");
      process.exit(1);
    }

    const hashedPassword = await hash(password, 12);

    const admin = new User({
      email,
      name,
      password: hashedPassword,
      isActive: true,
      role: "admin",
    });

    await admin.save();

    console.log(`\n✅ Admin user created successfully: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
