import Joi from "joi";
import { userGender, userRole } from "../../DataBase/models/user.model.js";
import { generalRules } from "../../utils/globle.js";




export const sigenUpSchema = {
  body: Joi.object({
    name: Joi.string().alphanum().min(2).max(10).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    confarmPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string()
      .pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/)
      .required(),
    age: Joi.number().min(18).max(60).required(),
    gender: Joi.string().valid(userGender.female, userGender.male),
    role: Joi.string().valid(userRole.user, userRole.admin),
  }).required(),
  // file:generalRules.file.required(),
  files:Joi.object({
    attatchment:Joi.array().items(generalRules.file.required()),
    attatchments:Joi.array().items(generalRules.file.required())
  }).required()
};
export const sigenINSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
  }).required()
  
};
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
    confarmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }).required()
};
export const forgetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required()
  }).required()
};
export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    otp: Joi.number().required(),
    newPassword: generalRules.password.required(),
    confarmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }).required()
};
export const updataProfileSchema = {
  body: Joi.object({
    name: Joi.string().alphanum().min(2).max(10),
    email: generalRules.email,
    phone: Joi.string().pattern(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/),
    age: Joi.number().min(18).max(60),
    gender: Joi.string().valid(userGender.female, userGender.male),
  }).required()
};
export const freezeProfileSchema = {
  params: Joi.object({
    id: Joi.string(),
  }).required()
};
export const unFreezeProfileSchema = {
  params: Joi.object({
    id: Joi.string(),
  }).required()
};
export const deleteProfileSchema = {
  params: Joi.object({
    id: Joi.string(),
  }).required()
};
