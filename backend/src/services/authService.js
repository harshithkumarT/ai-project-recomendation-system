import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../models/userModel.js";
import {
  findValidRefreshToken,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  saveRefreshToken
} from "../models/refreshTokenModel.js";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/token.js";

const ACCESS_PAYLOAD = (user) => ({ sub: user.id, role: user.role });

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, passwordHash });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = signAccessToken(ACCESS_PAYLOAD(user));
  const refreshToken = signRefreshToken(ACCESS_PAYLOAD(user));

  await saveRefreshToken({
    userId: user.id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  };
};

export const refreshUserToken = async (token) => {
  if (!token) {
    throw new AppError("Refresh token missing", 401);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const validToken = await findValidRefreshToken({
    userId: decoded.sub,
    tokenHash: hashRefreshToken(token)
  });

  if (!validToken) {
    throw new AppError("Refresh token revoked or expired", 401);
  }

  await revokeRefreshToken(validToken.id);

  const user = await findUserById(decoded.sub);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken(ACCESS_PAYLOAD(user));
  const refreshToken = signRefreshToken(ACCESS_PAYLOAD(user));

  await saveRefreshToken({
    userId: user.id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    user,
    accessToken,
    refreshToken
  };
};

export const logoutUser = async ({ userId, refreshToken }) => {
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded.sub === userId) {
        const valid = await findValidRefreshToken({
          userId,
          tokenHash: hashRefreshToken(refreshToken)
        });
        if (valid) {
          await revokeRefreshToken(valid.id);
        }
      }
    } catch {
      await revokeAllUserRefreshTokens(userId);
    }
  } else {
    await revokeAllUserRefreshTokens(userId);
  }
};
