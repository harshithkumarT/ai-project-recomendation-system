import { asyncHandler } from "../utils/asyncHandler.js";
import { getRefreshCookieOptions } from "../utils/cookie.js";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser
} from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
  res.status(200).json({ user, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken;
  const { user, accessToken, refreshToken } = await refreshUserToken(incomingToken);

  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());
  res.status(200).json({ user, accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (req.user) {
    await logoutUser({ userId: req.user.id, refreshToken });
  }

  res.clearCookie("refreshToken", getRefreshCookieOptions());
  res.status(200).json({ message: "Logged out" });
});
