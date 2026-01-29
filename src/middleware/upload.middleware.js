import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/customers";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    // Get agent name from request
    const firstName = req.agent?.firstName || "unknown";
    const lastName = req.agent?.lastName || "user";

    const fullname = firstName + "_" + lastName;

    const uniqueName = fullname + "_" +new Date().toISOString() + path.extname(file.originalname);

    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });
