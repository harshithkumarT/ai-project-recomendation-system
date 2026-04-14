import { env } from "../config/env.js";

const isProd = env.NODE_ENV === "production";

export const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/v1/auth"
});
