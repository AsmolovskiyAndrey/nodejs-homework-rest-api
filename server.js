const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const contactsRouter = require("./routers/contactsRouter");
const { connectMongo } = require("./db/connections");
// const { errorHandler } = require("./helpers/apiHelpers");
const PORT = process.env.PORT || 8083;

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// app.use(errorHandler); //! Обработка ошибок

// app.use((err, req, res, next) => {
//   const { status } = err;
//   res.status(status).json({ message: err.message });
//   next();
// });

const start = async () => {
  try {
    await connectMongo();

    app.listen(PORT, (err) => {
      if (err) console.error("Error at server launch:", err);
      console.log(`Server works on port:  ${PORT}`);
    });
  } catch (error) {
    console.error(`Mongo server not error: ${error.message}`);
  }
};
start();
