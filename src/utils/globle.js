import Joi from "joi";
import { Types } from "mongoose";

export const customId = (value, helper) => {
  const data = Types.ObjectId.isValid(value);

  return data ? value : helper.message("invalid ID");
};

export const generalRules = {
  email: Joi.string().email({
    tlds: { allow: false, deny: ["domen"] },
    minDomainSegments: 2,
    maxDomainSegments: 3,
  }),
  password: Joi.string(),
  headers: Joi.object({
    authorization: Joi.string().required(),
    Connection: Joi.string().required(),
    Accept: Joi.string().required(),
    Host: Joi.string().required(),
    "Postman-Token": Joi.string().required(),
    "Content-Type": Joi.string().required(),
    "Content-Length": Joi.string().required(),
    "User-Agent": Joi.string().required(),
    "Accept-Encoding": Joi.string().required(),
  }),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().required(),
  }).messages({'any.required':"file is required"}),
};
