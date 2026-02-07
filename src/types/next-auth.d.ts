import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser as BaseAdapterUser } from "@auth/core/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      isActive?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    isActive?: boolean;
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isActive?: boolean;
    role?: "user" | "admin";
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends BaseAdapterUser {
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isActive?: boolean;
  }
}
