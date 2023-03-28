const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routers/contactsRouter");
const { authRouter } = require("./routers/authRouter");
const { connectMongo } = require("./db/connections");
const { errorHandler } = require("./helpers/apiHelpers");
const PORT = process.env.PORT || 8083;

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// serve static files
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", authRouter);
// app.use("/api/avatars", fileRouter);

app.use(errorHandler); //! Обработка ошибок

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, (err) => {
      if (err) console.error("Error at server launch:", err);
      console.log(`Server works on port:  ${PORT}`);
    });
  } catch (error) {
    console.error(`Mongo server not working with error: ${error.message}`);
  }
};
start();
