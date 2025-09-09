import userModel, { userRole } from "../../DataBase/models/user.model.js";
import { generatToken } from "../../utils/Token/generatToken.js";
import { verifyToken } from "../../utils/Token/verfiyToken.js";
import { hashing } from "../../utils/bcrypt_hashing/hash.js";
import { compare } from "../../utils/bcrypt_hashing/comber.js";
import { encrypt } from "../../utils/crypto/encrypt.js";
import { decrypt } from "../../utils/crypto/decrypt.js";
import { customAlphabet, nanoid } from "nanoid";
import reveokTokenModel from "../../DataBase/models/revokeToken.model.js";
import { eventEmitter } from "../../utils/email/sendEmail.js";
import cloudinary from "../../utils/cloudniry/cloud.js";

//============= add user ================================================================//
export const sigenUp = async (req, res, next) => {
  const { name, email, password, phone, age, gender, role } = req.body;

  //==== email
  const findEmail = await userModel.findOne({ email });
  if (findEmail) {
    throw new Error("email is existed", { cause: "404" });
  }
  //====== hash password ======
  const hash = await hashing({
    plainText: password,
    saltOrRounds: process.env.SALTORROUNDS,
  });
  //====== crypto phone =======
  const crybPhone = await encrypt({
    plainText: phone,
    cipherText: process.env.PHONE_CRYPTO,
  });
  //======== muler ======
  let coverImagePaths=[]
  for (const file of req?.files?.attatchments) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(file?.path,{
    folder:`sarahaApp/users/${name}/Cover_Images`,
    use_filename:true,
    unique_filename:false,
    resource_type:'auto',
  })
coverImagePaths.push({secure_url,public_id})
  }
  const {secure_url,public_id} = await cloudinary.uploader.upload(req?.files?.attatchment[0].path,{  
    folder:`sarahaApp/users/${name}/Profile_Image`,
    use_filename:true,
    unique_filename:false,
    resource_type:'auto',
  })

 
  //====
  //sendEmail
  eventEmitter.emit("sendEmail", { email });

  //creating
  const user = await userModel.create({
    name,
    email,
    password: hash,
    phone: crybPhone,
    age,
    gender,
    role,
    profileImage:{secure_url,public_id},
    coverImage:coverImagePaths
  });
  return res
    .status(201)
    .json({ message: "user is created sucssisfully", user });
};

//============= get confirm =============//
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new Error("token is not founded");
  }
  const decode = await verifyToken({
    token,
    sec_key: process.env.SEND_EMAIL_KEY,
  });
  const user = await userModel.findOne({ email: decode.email });
  if (!user) {
    throw new Error("user is not exist");
  }
  user.confirm = true;
  await user.save();

  return res
    .status(200)
    .json({ message: "user confirmed succissfuly", user, decode });
};

//============= login user ================================================================//
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  //========= find user ========
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("user not exist");
  }
  //======== chick confirmed =====
  if (!user.confirm) {
    throw new Error("you must confirme your email frist", { cause: "404" });
  }
  //======= chickPassword =======
  const dycPassword = await compare({
    plainText: password,
    compareText: user.password,
  });
  // const dycPassword = bcrypt.compareSync(password, user.password);
  if (!dycPassword) {
    throw new Error("wrong password");
  }
  //======== creat token ========
  const access_token = await generatToken({
    payload: { id: user._id, email },
    sec_key:
      user.role === userRole.user
        ? process.env.USER_SIGNATUER
        : process.env.ADMIN_SIGNATUER,
    options: { expiresIn: "1h", jwtid: nanoid() },
  });
  const refresh_token = await generatToken({
    payload: { id: user._id, email },
    sec_key:
      user.role == userRole.user
        ? process.env.USER_REFRESH_SIGNIN_TOKEN
        : process.env.ADMIN_REFRESH_SIGNIN_TOKEN,
    options: { expiresIn: "1y", jwtid: nanoid() },
  });
  return res
    .status(200)
    .json({ message: "logged in succissfully", access_token, refresh_token });
};
//============= get profile ================================================================//
export const profile = async (req, res, next) => {
  // ===== decPhone
  const decryptPhone = await decrypt({
    plainText: req.user.phone,
    cipherText: PHONE_CRYPTO,
  });
  req.user.phone = decryptPhone;

  return res
    .status(200)
    .json({ message: "user profile is .......", user: req.user });
};
//============= logout =========================================================================//
export const logout = async (req, res, next) => {
  const reveokToken = await reveokTokenModel.create({
    tokenId: req.decode.jti,
    expireAt: req.decode.exp,
  });

  return res.status(200).json({
    message: "user profile is .......",
    user: req.user,
    decode: req.decode,
  });
};
//============= refreshToken =========================================================================//
export const refreshToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const [prefix, token] = authorization.split(" ") || [];
  if (!prefix || !token) {
    throw new Error("token is not exist", { cause: "404" });
  }
  let signatuer = "";
  if (prefix == "bearer") {
    signatuer = process.env.USER_REFRESH_SIGNIN_TOKEN;
  } else if (prefix == "admin") {
    signatuer = process.env.ADMIN_REFRESH_SIGNIN_TOKEN;
  }
  const decode = await verifyToken({ token, sec_key: signatuer });

  //========= find revoke ========
  const revoke = await reveokTokenModel.findOne({ jtokenId: decode.jti });
  if (revoke) {
    throw new Error("please login agin", { cause: "400" });
  }

  const user = await userModel.findOne({ email: decode.email });
  if (!user) {
    throw new Error("email is not exist", { cause: "404" });
  }
  //======== creat token ========
  const access_token = await generatToken({
    payload: { id: user._id, email: decode.email },
    sec_key:
      user.role === userRole.user
        ? process.env.USER_SIGNATUER
        : process.env.ADMIN_SIGNATUER,
    options: { expiresIn: "1h", jwtid: nanoid() },
  });
  const refresh_token = await generatToken({
    payload: { id: user._id, email: decode.email },
    sec_key:
      user.role == userRole.user
        ? process.env.USER_REFRESH_SIGNIN_TOKEN
        : process.env.ADMIN_REFRESH_SIGNIN_TOKEN,
    options: { expiresIn: "1y", jwtid: nanoid() },
  });
  return res
    .status(200)
    .json({ message: "user profile is .......", access_token, refresh_token });
};
//============= updatePassword ======================================================//
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (
    !(await compare({ plainText: oldPassword, compareText: req.user.password }))
  ) {
    throw new Error("oldPassword not correct", { cause: "404" });
  }
  const hash = await hashing({
    plainText: newPassword,
    saltOrRounds: process.env.SALTORROUNDS,
  });
  req.user.password = hash;
  await req.user.save();

  return res
    .status(200)
    .json({ message: "user profile is .......", uesr: req.user });
};
//============= forgetPassword ======================================================//
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("email not founded", { cause: "404" });
  }
  const otp = customAlphabet("0123456789", 5)();
  const otphash = await hashing({ plainText: otp });
  eventEmitter.emit("forgetPassword", { email, otp });
  user.otp = otphash;
  await user.save();

  return res.status(200).json({ message: " success " });
};
//============= resetPassword ======================================================//
export const resetPassword = async (req, res, next) => {
  const { email, newPassword, otp } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("email not founded", { cause: "404" });
  }
  if (!(await compare({ plainText: otp, compareText: user?.otp }))) {
    throw new Error("OTP not correct", { cause: "404" });
  }
  const hash = await hashing({
    plainText: newPassword,
    saltOrRounds: process.env.SALTORROUNDS,
  });

  await userModel.updateOne(
    { email },
    {
      password: hash,
      $unset: { otp: "" },
    }
  );
  // user.password = hash;
  // user.otp=""

  await user.save();

  return res.status(200).json({ message: "user profile is .......", user });
};

//============= updataProfile ======================================================//
export const updataProfile = async (req, res, next) => {
  const { name, email, phone, age, gender } = req.body;

  if (name) req.user.name = name;
  if (age) req.user.age = age;
  if (gender) req.user.gender = gender;
  if (phone) {
    const encryptPhone = await encrypt({
      plainText: phone,
      cipherText: process.env.PHONE_CRYPTO,
    });
    req.user.phone = encryptPhone;
  }
  if (email) {
    if (await userModel.findOne({ email })) {
      throw new Error("email already exist", { cause: "404" });
    }
    eventEmitter.emit("sendEmail", { email });
    req.user.email = email;
    req.user.confirm = false;
  }

  req.user.save();

  return res
    .status(201)
    .json({ message: "user profile is .......", uesr: req.user });
};

//============= get getProfileData ================================================================//
export const getProfileData = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel
    .findById(id)
    .select("-password -role -confirm -__v");
  if (!user) {
    throw new Error("email not founded", { cause: "404" });
  }

  // // ===== decPhone ===
  const decryptPhone = await decrypt({
    plainText: user.phone,
    cipherText: process.env.PHONE_CRYPTO,
  });
  user.phone = decryptPhone;

  return res.status(200).json({ message: "user profile is .......", user });
};
//============= freezeProfile ================================================================//
export const freezeProfile = async (req, res, next) => {
  const { id } = req.params;
  if (id && req.user.role !== userRole.admin) {
    throw new Error("Only Admin can freeze email");
  }
  const user = await userModel.updateOne({
    _id: id || req.user._id,
    isDeleted: { $exists: false },
    isDeleted: true,
    deletedBy: req.user._id,
    $inc: { __v: 1 },
  });

  // console.log(user);

  user.matchedCount
    ? res.status(200).json({ message: "user freazed ......." })
    : res.status(400).json({ message: "fail to freaz ......." });

  // return res
  //   .status(200)
  //   .json({ message: "user freazed .......",user,admin:req.user});
};
//============= unFreezeProfile ================================================================//
export const unFreezeProfile = async (req, res, next) => {
  const { id } = req.params;
  if (id && req.user.role !== userRole.admin) {
    throw new Error("Only Admin can freeze email");
  }
  const user = await userModel.updateOne(
    { _id: id || req.user._id, isDeleted: { $exists: true } },
    { $unset: { isDeleted: "", deletedBy: "" } },
    {$inc: { __v: 1 }}
  );

  user.matchedCount
    ? res.status(200).json({ message: "user unfreazed ......." })
    : res.status(400).json({ message: "fail to unfreaz ......." });

  // return res
  //   .status(200)
  //   .json({ message: "user freazed .......",user,admin:req.user});
};
//============= delete user =============//
export const deleteProfile = async (req, res, next) => {
  const { id } = req.params;
  if (id && req.user.role !== userRole.admin) {
    throw new Error("Only Admin can freeze email");
  }
  const user = await userModel.deleteOne( { _id: id || req.user._id } );
// console.log(user);

  user.deletedCount
    ? res.status(200).json({ message: "user deleted ......." })
    : res.status(400).json({ message: "fail to delete ......." });

  // return res
  //   .status(200)
  //   .json({ message: "user freazed .......",user,admin:req.user});
};

export const mkurlMessage =async (req, res, next) => {
  const {user}=req
  
  // console.log(user.id);
  return res
    .status(201)
    .json({ message: "URL is Created.......",URL:`${process.env.BASE_URL}/user/${user.id}/message/creat`});
};


//=============  updateProfileImage ================================================================//
export const updateProfileImage = async (req, res, next) => {
const {name,_id}=req.user


const {secure_url,public_id} = await cloudinary.uploader.upload(req?.file?.path,{  
  folder:`sarahaApp/users/${name}/Profile_Image`,
  use_filename:true,
  unique_filename:false,
  resource_type:'auto',
})
const LastUser = await userModel.findByIdAndUpdate({_id},{profileImage:{secure_url,public_id}})
// console.log(LastUser);

 await cloudinary.uploader.destroy(LastUser?.profileImage?.public_id)

  return res.status(200).json({ message: "user profile is .......",LastUser});
};
//=============  deleteProfileImage ================================================================//
export const deleteProfileImage = async (req, res, next) => {
const {name,_id}=req.user
const LastUser = await userModel.findByIdAndUpdate({_id},{profileImage:{}},{new:true})
await cloudinary.api.delete_resources_by_prefix(`sarahaApp/users/${name}/Profile_Image`)
await cloudinary.api.delete_folder(`sarahaApp/users/${name}/Profile_Image`)

  return res.status(200).json({ message: "peofile imege is deleted .......",LastUser});
};
// =============  updateCoverImages ================================================================//
export const updateCoverImages = async (req, res, next) => {
const {name,_id}=req.user
  let coverImagePaths=[]
  console.log(req?.files);
  
  for (const file of req?.files) {
        const {secure_url,public_id} = await cloudinary.uploader.upload(file?.path,{
    folder:`sarahaApp/users/${name}/Cover_Images`,
    use_filename:true,
    unique_filename:false,
    resource_type:'auto',
  })
coverImagePaths.push({secure_url,public_id})
  }
const LastUser = await userModel.findByIdAndUpdate({_id},{coverImage:coverImagePaths})
let public_ids =[]
for (const image of LastUser?.coverImage) {
  public_ids.push(image.public_id)
}

await cloudinary.api.delete_resources(public_ids)



  return res.status(200).json({ message: "user profile is .......",LastUser});
};
//=============  deleteCoverImage ================================================================//
export const deleteCoverImage = async (req, res, next) => {
const {name,_id}=req.user
const LastUser = await userModel.findByIdAndUpdate({_id},{coverImage:{}},{new:true})
await cloudinary.api.delete_resources_by_prefix(`sarahaApp/users/${name}/Cover_Images`)
await cloudinary.api.delete_folder(`sarahaApp/users/${name}/Cover_Images`)

  return res.status(200).json({ message: "cover imege is deleted .......",LastUser});
};

