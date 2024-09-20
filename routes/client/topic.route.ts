import { Router } from "express";

import * as controller from "../../controllers/client/topic.controller";

const router: Router = Router();

router.get("/topics", controller.topics);

export const topicRoutes: Router = router;
