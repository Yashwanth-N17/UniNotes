import { Router } from "express";
import {authenticate} from "../middlewares/auth.middleware.js";
import * as resourcesController from "../controllers/resources.controller.js";
import {upload} from "../utils/multer.js";

const router = Router();

router.post("/upload", authenticate, upload.single("file"), resourcesController.handleUploadResource);

export default router;