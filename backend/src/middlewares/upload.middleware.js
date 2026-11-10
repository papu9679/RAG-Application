import multer from "multer";
import path from "node:path";

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    const isPDF =
      file.mimetype === "application/pdf" &&
      path.extname(file.originalname).toLowerCase() === ".pdf";

    if (!isPDF) {
      const error = new Error("Only PDF files are allowed");
      error.statusCode = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

export { upload };