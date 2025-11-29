import multer from "multer";
import { UPLOAD_FOLDER } from "./config";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB
  },
});

export default upload;
