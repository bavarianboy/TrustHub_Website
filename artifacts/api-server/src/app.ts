import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { env } from "./lib/env";
import { uploadsDir } from "./lib/uploads";
import { errorHandler } from "./middlewares/error-handler";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(helmet());
// In production the API serves the built SPA itself (same-origin), so no CORS
// grant is needed — same-origin requests bypass CORS entirely, and `origin:
// false` refuses to add an Access-Control-Allow-Origin header for anything
// else. In dev the frontend runs on a separate Vite port and needs an
// explicit allowlisted origin — never a wildcard, since requests carry
// session cookies.
app.use(cors(env.corsOrigin ? { origin: env.corsOrigin, credentials: true } : { origin: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded images are served as plain static files, no auth needed to view
// them — only the POST that creates them (in router, below) is auth-gated.
app.use("/api/uploads", express.static(uploadsDir));
app.use("/api", router);

app.use(errorHandler);

export default app;
