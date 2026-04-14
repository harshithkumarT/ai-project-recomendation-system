import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import v1Routes from "./routes/v1/index.js";

const app = express();

const isAllowedDevOrigin = (origin) => {
  return /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools like curl/postman (no Origin header).
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origin === env.FRONTEND_URL) {
        callback(null, true);
        return;
      }

      if (env.NODE_ENV === "development" && isAllowedDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(apiLimiter);

app.use("/api/v1", v1Routes);

app.use(notFound);
app.use(errorHandler);

export default app;
