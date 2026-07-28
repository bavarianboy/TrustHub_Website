import type { Request } from "express";
import { HttpError } from "../middlewares/error-handler";

// Express 5's route-pattern typing widens req.params values to `string |
// string[]` for patterns that could repeat a segment; none of our routes do,
// so this narrows back to the single string every :param actually is.
export function requireParam(req: Request, name: string): string {
  const value = req.params[name];

  if (typeof value !== "string" || value.length === 0) {
    throw new HttpError(400, `Missing required path parameter: ${name}`);
  }

  return value;
}
