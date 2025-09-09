import multer from "multer";
import fs from "fs";

export const allawedExtention={
    image:["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
    video:['video/mp4']
}

export const myLocalMulter = ({customFile="generals",customExtention=[]}={}) => {
  const fullPath = `SarahaUploads/${customFile}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "_" + file.originalname);
    },
  });
  function fileFilter (req, file, cb) {
    if (!customExtention.includes(file.mimetype)) {
        cb(new Error('file not match correct types'))
    }else{

        cb(null, true)
    }
}

  const upload = multer({ storage,fileFilter });
  return upload;
};

export const myHostMulter = ({ customExtention = [] } = {}) => {
  const storage = multer.diskStorage({
    // filename: (req, file, cb) => {
    //   cb(null, Date.now() + path.extname(file.originalname));
    // }
  });

  function fileFilter(req, file, cb) {
    if (!customExtention.includes(file.mimetype)) {
      return cb(new Error("file not match correct types"), false);
    }
    cb(null, true);
  }

  return multer({ storage, fileFilter });
}; 