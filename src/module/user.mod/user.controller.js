import { Router } from "express";
import * as U from "./user.service.js";
import authentecation from "../../middleware/authentecation.js";
import { valdation } from "../../middleware/validation.js";
import * as UV from "./uesr.validation.js";
import { allawedExtention, myHostMulter } from "../../middleware/multer.js";
import messageRouter from "../message.mod/message.controller.js";
const userRouter = Router();
userRouter.use("/:id/message", messageRouter);

userRouter.post(
  "/siginUp",
  myHostMulter({ customExtention: allawedExtention.image }).fields([
    { name: "attatchment", maxCount: 1 },
    { name: "attatchments", maxCount: 3 },
  ]),
  valdation(UV.sigenUpSchema),
  U.sigenUp
);
userRouter.get("/confirmEmail/:token", U.confirmEmail);
userRouter.get("/login", valdation(UV.sigenINSchema), U.login);
userRouter.get("/profile", authentecation, U.profile);
userRouter.get("/getProfileData/:id", U.getProfileData);
userRouter.delete("/logout", authentecation, U.logout);
userRouter.get("/refreshToken", U.refreshToken);
userRouter.patch(
  "/updatePassword",
  authentecation,
  valdation(UV.updatePasswordSchema),
  U.updatePassword
);
userRouter.patch(
  "/forgetPassword",
  valdation(UV.forgetPasswordSchema),
  U.forgetPassword
);
userRouter.patch(
  "/resetPassword",
  valdation(UV.resetPasswordSchema),
  U.resetPassword
);
userRouter.patch(
  "/updataProfile",
  authentecation,
  valdation(UV.updataProfileSchema),
  U.updataProfile
);
userRouter.patch(
  "/freezeProfile{/:id}",
  authentecation,
  valdation(UV.freezeProfileSchema),
  U.freezeProfile
);
userRouter.patch(
  "/unFreezeProfile{/:id}",
  authentecation,
  valdation(UV.unFreezeProfileSchema),
  U.unFreezeProfile
);
userRouter.delete(
  "/deleteProfile{/:id}",
  authentecation,
  valdation(UV.deleteProfileSchema),
  U.deleteProfile
);

userRouter.post("/mkurlMessage", authentecation, U.mkurlMessage);
userRouter.patch(
  "/updateProfileImage",
  authentecation,
  myHostMulter({ customExtention: allawedExtention.image }).single(
      "attachment"
    ),
    U.updateProfileImage
);
userRouter.delete(
  "/deleteProfileImage",
  authentecation,
  myHostMulter({ customExtention: allawedExtention.image }).single(
      "attachment"
    ),
    U.deleteProfileImage
);

userRouter.patch(
    "/updateCoverImages",
    authentecation,
  myHostMulter({ customExtention: allawedExtention.image}).array( "attachments" , 3  ),
  U.updateCoverImages
);
userRouter.delete(
    "/deleteCoverImage",
    authentecation,
  myHostMulter({ customExtention: allawedExtention.image}).array( "attachments" , 3  ),
  U.deleteCoverImage
);

export default userRouter;
