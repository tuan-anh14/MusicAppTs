import { Router } from "express";
import multer from "multer";

import * as controller from "../../controllers/admin/song.controller";

import * as uploadCloud from "../../middlewares/admin/uploadCloudinary.middleware";

const upload = multer();

const router: Router = Router();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSinger,
  controller.createPost
);

export const songRoutes: Router = router;
