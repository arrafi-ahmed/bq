const router = require("express").Router();
const quizService = require("../service/quiz");
const ApiResponse = require("../model/ApiResponse");
const auth = require("../middleware/auth");

router.post("/parseTextToJson", (req, res, next) => {
  quizService
    .parseTextToJson(req.body, req.currentUser.id)
    .then((result) => {
      if (result) {
        res
          .status(200)
          .json(new ApiResponse("Parsing successful!", { result }));
      }
    })
    .catch((err) => next(err));
});

router.post("/saveQuiz", auth, (req, res, next) => {
  quizService
    .saveQuiz(req.body, req.currentUser.id)
    .then((result) => {
      if (result) {
        res.status(200).json(new ApiResponse("Quiz Saved!", null));
      }
    })
    .catch((err) => next(err));
});

router.get("/getQuizzes", auth, (req, res, next) => {
  quizService
    .getQuizzes(req.currentUser.id)
    .then((results) => {
      res.status(200).json(new ApiResponse(null, results));
    })
    .catch((err) => next(err));
});

router.get("/getQuiz", auth, (req, res, next) => {
  quizService
    .getQuiz(req.query.id)
    .then((result) => {
      res.status(200).json(new ApiResponse(null, result));
    })
    .catch((err) => next(err));
});

module.exports = router;
