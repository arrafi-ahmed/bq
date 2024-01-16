const cors = require("cors");
const CustomError = require("../model/CustomError");
const URL = require("url");

const excludedUrls = ["/api/user/acceptInvite"];

const customCors = (req, res, next) => {
  const baseUrl = process.env.VUE_BASE_URL;
  const hostname = URL.parse(baseUrl).hostname;
  const corsOptions = {
    origin: (origin, callback) => {
      let urlwww = `https://www.${hostname}`;
      const allowedOrigins = [baseUrl];
      if (urlwww) {
        allowedOrigins.push(urlwww);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        res.status(403).send("Not allowed by CORS");
      }
    },
    exposedHeaders: "authorization",
    credentials: true,
  };
  const isExcluded = excludedUrls.some((url) => req.originalUrl.includes(url));
  if (isExcluded) {
    return next();
  }
  return cors(corsOptions)(req, res, next);
};

module.exports = customCors;
