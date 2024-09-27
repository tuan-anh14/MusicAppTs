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
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  uploadCloud.uploadSinger,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadCloud.uploadFields,
  uploadCloud.uploadSinger,
  controller.editPatch,
);

export const songRoutes: Router = router;
