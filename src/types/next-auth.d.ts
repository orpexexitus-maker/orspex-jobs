// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "SEEKER" | "EMPLOYER" | "ADMIN" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "SEEKER" | "EMPLOYER" | "ADMIN" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
