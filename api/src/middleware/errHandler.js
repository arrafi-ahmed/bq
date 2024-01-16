const ApiResponse = require("../model/ApiResponse");
const CustomError = require("../model/CustomError");

const printError = (type, err) => {
  const time = new Date().toISOString().slice(0, 19).replace("T", " ");
  console.error("---", type, "ERR:", time, "---", err);
};

const globalErrHandler = (err, req, res, next) => {
  printError("GLOBAL", err);
  if (res.headersSent) {
    return next(err);
  }
  if (err) {
    res.setHeader("Content-Type", "application/json");
    if (err instanceof CustomError) {
      res.status(err.statusCode).json(new ApiResponse(err.message, null));
    } else {
      res.status(500).json(new ApiResponse("Something went wrong!", null));
    }
  }
  return next(err);
};

const uncaughtErrHandler = () => {
  process.on("uncaughtException", (err) => {
    printError("UNCAUGHT", err);
  });
};

module.exports = { globalErrHandler, uncaughtErrHandler };
