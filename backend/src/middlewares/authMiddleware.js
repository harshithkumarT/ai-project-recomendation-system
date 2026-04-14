import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.js";

export const protect = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch {
    return next(new AppError("Invalid or expired access token", 401));
  }
};

export const authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};
