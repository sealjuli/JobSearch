const { body, query, param } = require("express-validator");
const role = require("../helpers/role");

const validateBody = [
  body("date")
    .matches(/^(\d{2})\.(\d{2})\.(\d{4})$/)
    .withMessage("Дата должна быть в формате dd.MM.yyyy"),
  body("status")
    .isIn([
      "Отправлено",
      "Отказ сразу",
      "Отказ после ...",
      "+Тестовое",
      "Скрининг",
      "Техническое интервью",
      "Продумать",
    ])
    .withMessage(
      "Статус должено быть одним из перечисленных 'Отправлено', 'Отказ сразу', 'Отказ после ...', '+Тестовое', 'Скрининг', 'Техническое интервью', 'Продумать'."
    ),
  body("company")
    .isLength({ min: 3 })
    .withMessage("Наименование компании слишком короткое."),
  body("job_link").isURL().withMessage("Поле job_link должно быть ссылкой."),
  body("position")
    .isLength({ min: 3 })
    .withMessage("Название позиции слишком короткое."),
  body("cover_letter_sent")
    .isBoolean()
    .withMessage("Поле cover_letter_sent должено быть Boolean."),
  body("recruiters")
    .isArray()
    .withMessage('Поле "recruiters" должно быть массивом'),
  body("recruiters.*.name")
    .isLength({ min: 3 })
    .withMessage("Имя рекрутера слишком короткое."),
  body("recruiters.*.contact_method")
    .isIn(["Telegram", "LinkedIn", "Email"])
    .withMessage(
      "Возможный способ связи должен быть один из Telegram, LinkedIn, Email."
    ),
  body("recruiters.*.contact_info")
    .isLength({ min: 3 })
    .withMessage("Поле с контактной информацией слишком короткое."),
];

const validateOptionalBody = [
  body("date")
    .optional()
    .matches(/^(\d{2})\.(\d{2})\.(\d{4})$/)
    .withMessage("Дата должна быть в формате dd.MM.yyyy"),
  body("status")
    .optional()
    .isIn([
      "Отправлено",
      "Отказ сразу",
      "Отказ после ...",
      "+Тестовое",
      "Скрининг",
      "Техническое интервью",
      "Продумать",
    ])
    .withMessage(
      "Статус должено быть одним из перечисленных 'Отправлено', 'Отказ сразу', 'Отказ после ...', '+Тестовое', 'Скрининг', 'Техническое интервью', 'Продумать'."
    ),
  body("company")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Наименование компании слишком короткое."),
  body("job_link")
    .optional()
    .isURL()
    .withMessage("Поле job_link должно быть ссылкой."),
  body("position")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Название позиции слишком короткое."),
  body("cover_letter_sent")
    .optional()
    .isBoolean()
    .withMessage("Поле cover_letter_sent должено быть Boolean."),
  body("recruiters")
    .optional()
    .isArray()
    .withMessage('Поле "recruiters" должно быть массивом'),
  body("recruiters.*.name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Имя рекрутера слишком короткое."),
  body("recruiters.*.contact_method")
    .optional()
    .isIn(["Telegram", "LinkedIn", "Email"])
    .withMessage(
      "Возможный способ связи должен быть один из Telegram, LinkedIn, Email."
    ),
  body("recruiters.*.contact_info")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Поле с контактной информацией слишком короткое."),
];

const validateParamId = [
  param("id").isLength({ min: 1 }).withMessage("Id вакансии неверный."),
];

const validateParamStatus = [
  param("status")
    .isIn([
      "Отправлено",
      "Отказ сразу",
      "Отказ после ...",
      "+Тестовое",
      "Скрининг",
      "Техническое интервью",
      "Продумать",
    ])
    .withMessage("Статус для фильтрации по вакансиям задан неверно."),
];

const validateUserTypeStudent = [
  query("userType")
    .equals(role.student)
    .withMessage("Данное действие доступно только для студентов."),
];

module.exports = {
  validateBody,
  validateUserTypeStudent,
  validateOptionalBody,
  validateParamId,
  validateParamStatus,
};
