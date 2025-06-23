import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      user_id?: string | null;
      email?: string | null;
      expired?: number | null;
      role?: string | null;
      token?: string;
      refreshToken?: string;
    };
  }

  interface User {
    token?: string;
    refreshToken?: string;
  }
  interface ResponseAuth {
    success?: boolean;
    message?: string;
    data?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    exp?: number;
  }
}
