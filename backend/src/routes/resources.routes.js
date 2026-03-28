import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import * as resourcesController from "../controllers/resources.controller.js";
import { upload } from "../utils/multer.js";

const resourcesRouter = Router();

resourcesRouter.get("/", resourcesController.handleGetResources);

resourcesRouter.use(authenticate);

resourcesRouter.post("/", upload.single("file"), resourcesController.handleUploadResource);
resourcesRouter.get("/me", resourcesController.handleGetUserResources);


export default resourcesRouter;