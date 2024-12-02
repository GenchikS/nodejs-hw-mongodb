import { Router } from "express";
import * as authControllers from "../controllers/auth.js";
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  authRegisterSchema,
  authLoginSchema,
  resetPasswordSchema,
  newPasswordSchema,
} from '../validation/auth.js';


const authRouter = Router();
authRouter.post(`/register`,
  // validateBody(authRegisterSchema),
  ctrlWrapper(authControllers.registerController));
// authRouter.get(`/verify`, ctrlWrapper(authControllers.verifyController));
authRouter.post(`/login`, validateBody(authLoginSchema), ctrlWrapper(authControllers.loginController));
authRouter.post(`/refresh`, ctrlWrapper(authControllers.refreshSessionController)); 
authRouter.post(`/logout`, ctrlWrapper(authControllers.logoutController));

authRouter.post(`/send-reset-email`, validateBody(resetPasswordSchema), ctrlWrapper(authControllers.sendResetEmailController));
authRouter.post(`/reset-pwd`, validateBody(newPasswordSchema), ctrlWrapper(authControllers.sendNewPasswordController));

export default authRouter;