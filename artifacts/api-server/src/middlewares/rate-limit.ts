import rateLimit from "express-rate-limit";

// Loose enough for a real visitor to retry after a typo, tight enough to blunt
// a scripted flood of the public contact form.
export const leadsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

// Slows down credential-stuffing / brute-force attempts against admin login.
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});
