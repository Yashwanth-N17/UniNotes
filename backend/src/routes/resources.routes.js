import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as resourcesController from "../controllers/resources.controller.js";
import { upload } from "../utils/multer.js";

const resourcesRouter = Router();

resourcesRouter.post("/upload", authenticate, upload.single("file"), resourcesController.handleUploadResource);
resourcesRouter.get("/getUserResources", authenticate, resourcesController.handleGetUserResources);
resourcesRouter.get("/getAllResources", resourcesController.handleGetAllResources);

export default resourcesRouter;