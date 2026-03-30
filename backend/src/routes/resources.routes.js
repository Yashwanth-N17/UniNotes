import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as resourcesController from "../controllers/resources.controller.js";
import { upload } from "../utils/multer.js";

const resourcesRouter = Router();

resourcesRouter.get("/", resourcesController.handleGetResources);
resourcesRouter.get("/me", authenticate, resourcesController.handleGetUserResources);
resourcesRouter.get("/:id", resourcesController.handleGetResourceById);

resourcesRouter.use(authenticate);

resourcesRouter.post("/", upload.single("file"), resourcesController.handleUploadResource);
resourcesRouter.delete("/:id", resourcesController.handleDeleteResource);

export default resourcesRouter;