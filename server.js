require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const cron = require("node-cron");
const { deleteExpiredCartItems } = require("./controllers/cartItemController");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const database = process.env.DATABASE;

mongoose.connect(database, {
  useNewUrlParser: true,
  dbName: "e-commerce",
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("MONGO CONNECTION OPEN"));

const port = process.env.PORT || 8000;

cron.schedule("*/10 * * * *", async () => {
  deleteExpiredCartItems();
});

app.listen(port, () => {
  console.log(`LISTENING TO PORT ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
