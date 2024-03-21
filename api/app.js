require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
process.env.TZ = "UTC";
const express = require("express");
const app = express();
const path = require("path");
const userAgent = require("./src/middleware/userAgent");
const customCors = require("./src/middleware/customCors");
const {
  globalErrHandler,
  uncaughtErrHandler,
} = require("./src/middleware/errHandler");
const port = process.env.PORT || 3000;

//middlewares
app.use(userAgent);
app.use(customCors);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//routes
app.use("/api/user", require("./src/controller/user"));
app.use("/api/quiz", require("./src/controller/quiz"));

app.get("/api/version", (req, res) => {
  res.status(200).json({ version: 1.0 });
});

app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log(`Server started at ${port} - ${new Date()}`);
});

uncaughtErrHandler();
app.use(globalErrHandler);

// module.exports = app;
