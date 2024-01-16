const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const CustomError = require("../model/CustomError");
const { getDirPath } = require("../others/util");

const maxSize = 25 * 1024 * 1024; // 25 MB
const tempDir = getDirPath("tmp");

function createUpload(prefix) {
  return (req, res, next) => {
    // If the request is not multipart/form-data, skip file processing
    if (!req.is("multipart/form-data")) {
      return next();
    }

    const busboy = Busboy({
      headers: req.headers,
      limits: { fileSize: maxSize },
    });

    let files = [];
    busboy.on("file", (name, file, info) => {
      const ext = path.extname(info.filename).toLowerCase();

      // Only allow .jpg, .jpeg, and .png files
      if (![".jpg", ".jpeg", ".png"].includes(ext)) {
        return next(
          new CustomError(
            "Invalid file type! Only .jpg, .jpeg, and .png files are allowed.",
            415
          )
        );
      }

      const newName =
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e5) +
        path.extname(info.filename);
      const saveTo = path.join(tempDir, newName);

      const writeStream = fs.createWriteStream(saveTo);
      try {
        file.pipe(writeStream);
      } catch (err) {
        next(err);
      }

      const filePromise = new Promise((resolve, reject) => {
        writeStream.on("finish", async () => {
          try {
            const stats = await fs.promises.stat(saveTo);
            const fileData = {
              destination: tempDir,
              filename: newName,
              path: saveTo,
              size: stats.size,
            };
            resolve(fileData);
          } catch (err) {
            reject(err);
          }
        });

        writeStream.on("error", (err) => {
          reject(err);
        });
      });

      files.push(filePromise);
    });

    busboy.on("field", function (fieldname, val) {
      req.body[fieldname] = val;
    });

    busboy.on("finish", async () => {
      try {
        if (files.length > 0) {
          req.files = await Promise.all(files);
        }
        next();
      } catch (err) {
        next(err);
      }
    });

    busboy.on("error", (err) => {
      return next(err);
    });
    return req.pipe(busboy);
  };
}

const uploadUser = createUpload("user");
const uploadEventLogo = createUpload("eventLogo");

module.exports = { uploadUser, uploadEventLogo };
