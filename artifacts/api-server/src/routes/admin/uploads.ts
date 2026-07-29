import { Router, type IRouter } from "express";
import crypto from "node:crypto";
import path from "node:path";
import multer from "multer";
import { AdminUploadImageResponse } from "@workspace/api-zod";
import { requireAuth } from "../../middlewares/require-auth";
import { HttpError } from "../../middlewares/error-handler";
import { uploadsDir } from "../../lib/uploads";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const ext = ALLOWED_MIME_TYPES[file.mimetype] ?? path.extname(file.originalname);
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(new HttpError(400, "Only JPEG, PNG, WebP, and GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

const router: IRouter = Router();
router.use(requireAuth);

router.post("/uploads", (req, res, next) => {
  upload.single("file")(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        next(new HttpError(400, "Image must be 5MB or smaller"));
        return;
      }
      next(err instanceof HttpError ? err : new HttpError(400, "Upload failed"));
      return;
    }
    if (!req.file) {
      next(new HttpError(400, "No file uploaded"));
      return;
    }
    res.status(201).json(AdminUploadImageResponse.parse({ url: `/api/uploads/${req.file.filename}` }));
  });
});

export default router;
