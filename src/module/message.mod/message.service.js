import messageModel from "../../DataBase/models/message.model.js";
import userModel from "../../DataBase/models/user.model.js";

export const creatMessage = async (req, res, next) => {
  try {
    const { content, title } = req.body;
    const { id } = req.params;
    console.log(req.params);
    console.log(req.oregenalUrl);
    
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "URL isn't correct" });
    }
    const message = await messageModel.create({
      user_Id:id,
      content,
      title,
    });
    return res.status(201).json({
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create message",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res, next) => {
    const {user}=req
    const messages = await messageModel.find({user_Id:user?._id})
        return res.status(200).json({
      message: "All Messages For you",
      messages,
})

};


