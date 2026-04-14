import { AppError } from "../utils/AppError.js";

export const validate = (schema, target = "body") => (req, _res, next) => {
  const parsed = schema.safeParse(req[target]);

  if (!parsed.success) {
    return next(new AppError("Validation failed", 400, parsed.error.flatten().fieldErrors));
  }

  req[target] = parsed.data;
  return next();
};
