const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection successful");
    return connect;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = { connectMongo };
