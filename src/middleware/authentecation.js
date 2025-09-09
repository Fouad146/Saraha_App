import userModel from "../DataBase/models/user.model.js";
import { verifyToken } from "../utils/Token/verfiyToken.js";
import reveokTokenModel from "../DataBase/models/revokeToken.model.js";

const authentecation = async (req, res, next) => {
  const { authorization } = req.headers;
  const [prefix, token] = authorization.split(" ") || [];
  if (!prefix || !token) {
    throw new Error("token is not exist",{cause:'404'});
  }
  let signatuer = "";
  if (prefix == "bearer") {
    signatuer = process.env.USER_SIGNATUER;
  } else if (prefix == "admin") {
    signatuer = process.env.ADMIN_SIGNATUER;
  }
  const decode = await verifyToken({ token, sec_key: signatuer });
    //========= find revoke ========
  const revoke = await reveokTokenModel.findOne({ jtokenId:decode.jti });
  if (revoke) {
    throw new Error("please login agin",{cause:'400'});
  }

  const user = await userModel.findOne({ email: decode.email });
  if (!user) {
    throw new Error("email is not exist",{cause:'404'});
  }

  req.user = user;
  req.decode =decode

  return next();
};
export default authentecation;
