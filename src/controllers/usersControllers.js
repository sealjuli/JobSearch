const UsersServices = require("../services/usersServices");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Sentry = require("@sentry/node");

class UsersControllers {
  async userRegister(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { login, password, userType } = req.body;

      // Проверка, что пользователь с таким login не существует
      const existingUser = await UsersServices.findUserByLogin(login);
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким login уже существует" });
      }

      // Хэширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создание нового пользователя
      const newUser = {
        userType,
        login,
        password: hashedPassword,
      };
      await UsersServices.saveUser(newUser);

      res.send("Новый пользователь зарегестрирован");
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка регистрации пользователя" });
    }
  }

  async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { login, password } = req.body;

      // Поиск пользователя по login
      const user = await UsersServices.findUserByLogin(login);
      if (!user) {
        return res.status(401).json({ message: "Неверный login или password" });
      }

      // Проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Неверный login или password" });
      }

      // Создание JWT-токена для авторизации
      const token = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ token });
    } catch (error) {
      Sentry.captureException(error);
      console.error(error);
      res.status(500).json({ message: "Ошибка входа в систему" });
    }
  }

  async getStudents(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const students = await UsersServices.getAllStudents();
      res.send(students);
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  }
}

module.exports = new UsersControllers();
