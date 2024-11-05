require("dotenv").config();
const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swaggerSpec.js");

const app = express();

const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.DSN });

Sentry.setupExpressErrorHandler(app);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

function loggerMiddleware(req, res, next) {
  console.log(`Запрос по адресу: ${req.url}`);
  next();
}

app.use(loggerMiddleware);

const router = require("./routes");
app.use("/api", router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
