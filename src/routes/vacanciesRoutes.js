const express = require("express");
const router = express.Router();

const VacanciesControllers = require("../controllers/vacanciesControllers");
const authenticateToken = require("../middleware/authentificateToken");
const validationMiddleware = require("../middleware/validationVacancy");

/**
 * @swagger
 * /api/vacancies:
 *    post:
 *      summary: Создание новой вакансии
 *      description: Добавить в базу данных новую вакансию
 *      tags:
 *        - Vacancies
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *        $ref: "#/components/requestBodies/Vacancies"
 *      responses:
 *        200:
 *          description: Вакансия успешно добавлена в базу данных
 * components:
 *   requestBodies:
 *     Vacancies:
 *       description: Данные вакансии для добавления в базу данных
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 01.01.2024
 *                 description: Дата создания вакансии
 *               status:
 *                 type: string
 *                 enum:
 *                   - Отправлено
 *                   - Отказ сразу
 *                   - Отказ после ...
 *                   - +Тестовое
 *                   - Скрининг
 *                   - Техническое интервью
 *                   - Продумать
 *                 example: Отправлено
 *                 description: Статус вакансии
 *               company:
 *                 type: string
 *                 example: Би-Лоджик
 *                 description: Название компании
 *               recruiters:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Иван Иванов
 *                       description: Имя рекрутера
 *                     contact_method:
 *                       type: string
 *                       enum:
 *                         - Telegram
 *                         - LinkedIn
 *                         - Email
 *                       example: Telegram
 *                       description: Метод связи с рекрутером
 *                     contact_info:
 *                       type: string
 *                       example: "@ivanov"
 *                       description: Контактная информация рекрутера
 *                 example: [{"name": "Иван Иванов", "contact_method": "Telegram", "contact_info": "@ivanov"}, {"name": "Мария Петрова", "contact_method": "LinkedIn", "contact_info": "linkedin.com/in/maria-petrova"}]
 *                 description: Список рекрутеров в формате JSON
 *               job_link:
 *                 type: string
 *                 example: https://rabota.by/search/vacancy?from=employerPage&employer_id=961519&hhtmFrom=employer
 *                 description: Ссылка на вакансию
 *               position:
 *                 type: string
 *                 example: Frontend developer
 *                 description: Название позиции
 *               cover_letter_sent:
 *                 type: boolean
 *                 example: true
 *                 description: Отправлено ли сопроводительное письмо
 */
router.post(
  "/",
  authenticateToken,
  validationMiddleware.validateUserTypeStudent,
  validationMiddleware.validateBody,
  VacanciesControllers.createVacancy
);

/**
 * @swagger
 * /api/vacancies:
 *   get:
 *     summary: Просмотр списка вакансий
 *     description: Получение списка вакансий из базы данных
 *     tags:
 *       - Vacancies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: studentId
 *         in: query
 *         required: false
 *         description: Для преподавателей - идентификатор студента для отбора только его вакансий
 *         schema:
 *           type: string
 *           example: "6728c564a1dc5f7e518e94c7"
 *     responses:
 *       200:
 *         description: Массив вакансий
 * components:
 *   schemas:
 *     Vacancy:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *           description: Дата создания вакансии
 *         status:
 *           type: string
 *           enum:
 *             - Отправлено
 *             - Отказ сразу
 *             - Отказ после ...
 *             - +Тестовое
 *             - Скрининг
 *             - Техническое интервью
 *             - Продумать
 *           example: Отправлено
 *           description: Статус вакансии
 *         company:
 *           type: string
 *           example: Би-Лоджик
 *           description: Название компании
 *         recruiters:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Иван Иванов
 *                 description: Имя рекрутера
 *               contact_method:
 *                 type: string
 *                 enum:
 *                   - Telegram
 *                   - LinkedIn
 *                   - Email
 *                 example: Telegram
 *                 description: Метод связи с рекрутером
 *               contact_info:
 *                 type: string
 *                 example: "@ivanov"
 *                 description: Контактная информация рекрутера
 *           example: [{"name": "Иван Иванов", "contact_method": "Telegram", "contact_info": "@ivanov"}, {"name": "Мария Петрова", "contact_method": "LinkedIn", "contact_info": "linkedin.com/in/maria-petrova"}]
 *           description: Список рекрутеров в формате JSON
 *         job_link:
 *           type: string
 *           example: https://rabota.by/search/vacancy?from=employerPage&employer_id=961519&hhtmFrom=employer
 *           description: Ссылка на вакансию
 *         position:
 *           type: string
 *           example: Frontend developer
 *           description: Название позиции
 *         cover_letter_sent:
 *           type: boolean
 *           example: true
 *           description: Отправлено ли сопроводительное письмо
 */
router.get("/", authenticateToken, VacanciesControllers.getVacancies);

/**
 * @swagger
 * /api/vacancies/{id}:
 *   patch:
 *     summary: Редактирование вакансии
 *     description: Обновляет вакансию по его id
 *     tags:
 *       - Vacancies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Идентификатор вакансии
 *     requestBody:
 *        $ref: "#/components/requestBodies/Vacancies"
 *     responses:
 *       200:
 *         description: Данные вакансии успешно обновлены.
 */
router.patch(
  "/:id",
  authenticateToken,
  validationMiddleware.validateUserTypeStudent,
  validationMiddleware.validateOptionalBody,
  validationMiddleware.validateParamId,
  VacanciesControllers.updateVacancy
);

/**
 * @swagger
 * /api/vacancies/{id}:
 *    delete:
 *      summary: Удаление вакансии
 *      description: Удаление вакансии из дазы данных
 *      tags:
 *        - Vacancies
 *      security:
 *       - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Идентификатор вакансии
 *      responses:
 *        200:
 *          description: Успешное удаление вакансии
 */
router.delete(
  "/:id",
  authenticateToken,
  validationMiddleware.validateUserTypeStudent,
  validationMiddleware.validateParamId,
  VacanciesControllers.deleteVacancy
);

/**
 * @swagger
 * /api/vacancies/{status}:
 *   get:
 *     summary: Фильтрация вакансий по статусу
 *     description: Получение списка вакансий из базы данных по статусу
 *     tags:
 *       - Vacancies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: status
 *          required: true
 *          schema:
 *            type: string
 *          description: Статус вакансии
 *        - in: query
 *          name: studentId
 *          required: false
 *          description: Для преподавателей - идентификатор студента для отбора только его вакансий
 *          schema:
 *            type: string
 *            example: "6728c564a1dc5f7e518e94c7"
 *     responses:
 *       200:
 *         description: Массив вакансий
 */
router.get(
  "/:status",
  authenticateToken,
  validationMiddleware.validateParamStatus,
  VacanciesControllers.getVacanciesByStatus
);

module.exports = router;
