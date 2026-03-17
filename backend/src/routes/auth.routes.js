import {Router} from "express";
import * as authController from "../controllers/auth.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js"


const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.get("/get-me", authenticate, authController.getMe);
authRouter.get("/refresh-token", authController.refreshToken);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.put("/update-profile", authenticate, authController.updateUser);

export default authRouter;