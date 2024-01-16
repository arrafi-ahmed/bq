const router = require("express").Router();
const quizService = require("../service/quiz");
const ApiResponse = require("../model/ApiResponse");

router.post("/parseTextToJson", (req, res, next) => {
  quizService
    .parseTextToJson(req.body)
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json(new ApiResponse("Parsing successful!", { result }));
      }
    })
    .catch((err) => next(err));
});

module.exports = router;
