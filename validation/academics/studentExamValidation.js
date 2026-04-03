const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const optionKeys = ["optionA", "optionB", "optionC", "optionD"];

const studentExamAnswerSchema = Joi.object({
  questionId: objectId.required(),
  selectedOption: Joi.string()
    .valid(...optionKeys)
    .required()
    .messages({
      "any.only": `selectedOption must be one of: ${optionKeys.join(", ")}`,
    }),
}).options({ stripUnknown: true });

module.exports = { studentExamAnswerSchema };
