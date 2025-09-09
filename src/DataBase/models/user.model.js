import mongoose from "mongoose";

export const userGender = {
  male: "male",
  female: "female",
};
export const userRole = {
  user: "user",
  admin: "admin",
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
    max: 60,
  },
  gender: {
    type: String,
    enum: Object.values(userGender),
    default: userGender.male,
  },
  role: {
    type: String,
    enum: Object.values(userRole),
    default: userRole.user,
  },
  profileImage: {
    public_id: { type: String },
    secure_url: { type: String },
  },
  coverImage: [{
    public_id: { type: String },
    secure_url: { type: String },
  }],
  confirm: {
    type: Boolean,
    default: false,
  },
  otp: String,
  isDeleted: Boolean,
  deletedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const userModel = mongoose.model.User || mongoose.model("User", userSchema);
export default userModel;
