import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// Express 5 forwards rejected async handlers here automatically.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  logger.error({ err, url: req.url }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
}
