const VacanciesServices = require("../services/vacanciesServices");

const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");

class VacanciesControllers {
  async createVacancy(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await VacanciesServices.createVacancy({
        ...req.body,
        studentId: req.userId,
      });
      res.send(
        `Новая вакансия создана. ${JSON.stringify({
          ...req.body,
          studentId: req.userId,
        })}`
      );
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка при создании вакансии" });
    }
  }

  async getVacancies(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let vacancies = [];
      console.log(req.query.userType)
      if (req.query.userType === "student") {
        console.log(req.userId)
        vacancies = await VacanciesServices.getStudentVacancies(req.userId);
      } else if (req.query.userType === "teacher") {
        if (req.query.studentId) {
          vacancies = await VacanciesServices.getStudentVacancies(
            req.query.studentId
          );
        } else {
          vacancies = await VacanciesServices.getAllVacancies();
        }
      }
      res.send(vacancies);
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка при получении списка вакансий" });
    }
  }

  async deleteVacancy(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const vacancy = await VacanciesServices.findVacancyById(
        req.userId,
        req.params.id
      );
      if (!vacancy) {
        res.send("Вакансия с указанным id не найдена");
      } else {
        await VacanciesServices.deleteVacancy(req.params.id);
        res.send("Вакансия удалена.");
      }
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка удаления вакансии" });
    }
  }

  async updateVacancy(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const vacancy = await VacanciesServices.findVacancyById(
        req.userId,
        req.params.id
      );
      if (!vacancy) {
        res.send("Вакансия с указанным id не найдена");
      } else {
        await VacanciesServices.updateVacancy(req.params.id, req.body);
        res.send("Вакансия обновлена.");
      }
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка при обновлении вакансии" });
    }
  }

  async getVacanciesByStatus(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let vacancies = [];

      if (req.query.userType === "student") {
        vacancies = await VacanciesServices.getStudentVacanciesByStatus(
          req.userId,
          req.params.status
        );
      } else if (req.query.userType === "teacher") {
        if (req.query.studentId) {
          vacancies = await VacanciesServices.getStudentVacanciesByStatus(
            req.query.studentId,
            req.params.status
          );
        } else {
          vacancies = await VacanciesServices.getAllVacanciesByStatus(
            req.params.status
          );
        }
      }

      if (vacancies.length > 0) {
        res.send(JSON.stringify(vacancies));
      } else {
        res.send("Вакансии с указанным статусом отсутствуют.");
      }
    } catch (error) {
      console.log(error)
      Sentry.captureException(error);
      res.status(500).json({ message: "Ошибка при получении списка вакансии" });
    }
  }
}

module.exports = new VacanciesControllers();
