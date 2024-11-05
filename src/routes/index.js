const express = require("express");
const vacanciesRoutes = require("./vacanciesRoutes");
const UsersControllers = require("../controllers/usersControllers");
const validationMiddleware = require("../middleware/validationUser");

const router = express.Router();
router.use("/vacancies", vacanciesRoutes);

/**
 * @swagger
 * /api/register:
 *    post:
 *      summary: Регистрация нового пользователя
 *      description: Зарегестрировать нового пользователя
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/Users"
 *      responses:
 *        200:
 *          description: Пользователь успешно зарегестрирован
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 3f1f954a-b756-4c6e-84fe-7d428a6ccaff
 *           description: Уникальный идентификатор пользователя.
 *         user_type:
 *           type: string
 *           enum:
 *             - student
 *             - teacher
 *           example: student
 *           description: Тип пользователя (студент или преподаватель).
 *         login:
 *           type: string
 *           example: Login
 *           description: Логин пользователя (уникальный).
 *         password:
 *           type: string
 *           example: 111111
 *           description: Пароль пользователя.
 *   requestBodies:
 *     Users:
 *       description: Данные пользователя для регистрации
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userType:
 *                 type: string
 *                 enum:
 *                   - student
 *                   - teacher
 *                 example: student
 *                 description: Тип пользователя (студент или преподаватель).
 *               login:
 *                 type: string
 *                 example: example
 *                 description: Логин пользователя.
 *               password:
 *                 type: string
 *                 example: 111111
 *                 description: Пароль пользователя.
 */
router.post(
  "/register",
  validationMiddleware.validateBodyUser,
  validationMiddleware.validateUserType,
  UsersControllers.userRegister
);

/**
 * @swagger
 * /api/login:
 *    post:
 *      summary: Аутентификация пользователя
 *      description: Идентификация пользователя по логину и паролю в приложении
 *      tags:
 *        - Users
 *      requestBody:
 *        $ref: "#/components/requestBodies/Login"
 *      responses:
 *        200:
 *          description: Пользователь успешно аутентифицирован
 * components:
 *   requestBodies:
 *     Login:
 *       description: Данные пользователя для аутентификации
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: example
 *                 description: Логин пользователя.
 *               password:
 *                 type: string
 *                 example: 111111
 *                 description: Пароль пользователя.
 */
router.post(
  "/login",
  validationMiddleware.validateBodyUser,
  UsersControllers.loginUser
);

module.exports = router;
