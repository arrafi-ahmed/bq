const gm = require("gm").subClass({ imageMagick: true });
const fs = require("fs");
const { promisify } = require("util");
const { getFilePath, getPrefix } = require("../others/util");
const path = require("path");

const unlinkAsync = promisify(fs.unlink);

const compressAndRotateImage = async (file) => {
  const prefix = getPrefix(file.filename);
  let maxWidth;
  if (prefix === "user") {
    maxWidth = 400;
  } else if (prefix === "eventLogo") {
    maxWidth = 900;
  }

  const destFilePath = getFilePath(file.filename);
  const parsedPath = path.parse(destFilePath);

  // Change the extension to .jpeg
  parsedPath.ext = ".jpeg";
  parsedPath.base = `${parsedPath.name}${parsedPath.ext}`;
  // Format the path object back to a string
  const newDestFilePath = path.format(parsedPath);

  await new Promise((resolve, reject) => {
    gm(file.path)
      .autoOrient()
      .resize(maxWidth)
      .quality(80)
      .strip() // Remove metadata
      .setFormat("jpeg")
      .write(newDestFilePath, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });

  await unlinkAsync(file.path);

  file.destination = undefined;
  file.filename = parsedPath.base;
  file.path = newDestFilePath;
  const stats = await fs.promises.stat(newDestFilePath);
  file.size = stats.size;

  return file;
};

const compressImages = async (req, res, next) => {
  // Check if there are no files to compress
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    if (req.files.length > 0) {
      req.files = await Promise.all(
        req.files.map(async (file) => {
          file = await compressAndRotateImage(file);
          return file;
        })
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = compressImages;
