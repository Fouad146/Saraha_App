import { Router } from "express";
import * as MS from "./message.service.js";
import authentecation from "../../middleware/authentecation.js";

const messageRouter = Router({
  strict: true,
  caseSensitive: true,
  mergeParams: true,
});

messageRouter.post("/create", MS.creatMessage);
messageRouter.get("/allmessages", authentecation, MS.getAllMessages);

export default messageRouter;
