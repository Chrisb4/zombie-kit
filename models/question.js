var mongoose = require("mongoose");

var questionSchema = {
  question: String,
  choiceA: String,
  choiceB: String,
  responseA: String,
  responseB: String,
  productKeywordA: String,
  productKeywordB: String
};

var Question = mongoose.model("Question", questionSchema);

module.exports = Question


