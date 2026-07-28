import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import authRouter from "./auth";
import articlesRouter from "./articles";
import adminLeadsRouter from "./admin/leads";
import adminArticlesRouter from "./admin/articles";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(authRouter);
router.use(articlesRouter);
router.use("/admin", adminLeadsRouter);
router.use("/admin", adminArticlesRouter);

export default router;
