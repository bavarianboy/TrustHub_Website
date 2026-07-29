import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import authRouter from "./auth";
import articlesRouter from "./articles";
import pageContentRouter from "./page-content";
import adminLeadsRouter from "./admin/leads";
import adminArticlesRouter from "./admin/articles";
import adminPageContentRouter from "./admin/page-content";
import adminUploadsRouter from "./admin/uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(authRouter);
router.use(articlesRouter);
router.use(pageContentRouter);
router.use("/admin", adminLeadsRouter);
router.use("/admin", adminArticlesRouter);
router.use("/admin", adminPageContentRouter);
router.use("/admin", adminUploadsRouter);

export default router;
