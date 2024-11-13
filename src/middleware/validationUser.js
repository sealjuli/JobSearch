const { body, query } = require("express-validator");

const validateBodyUser = [
  body("login")
    .isLength({ min: 4 })
    .withMessage("Логин пользователя должен содержать больше 3 символов."),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Пароль должен содержать больше 3 символов"),
];

const validateUserType = body("userType")
  .isIn(["student", "teacher"])
  .withMessage("Тип пользователя либо student, либо teacher.");

const validateUserTypeTeacher = [
  query("userType")
    .equals("teacher")
    .withMessage("Данное действие доступно только для преподавателей."),
];

module.exports = {
  validateBodyUser,
  validateUserType,
  validateUserTypeTeacher,
};
