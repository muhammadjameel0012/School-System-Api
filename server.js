require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const connectDatabase = require("./utils/dataBase");

if (!process.env.JWT_SECRET_KEY) {
  console.error("FATAL: JWT_SECRET_KEY is not set in config.env. Copy config.env.example to config.env and set JWT_SECRET_KEY.");
  process.exit(1);
}

connectDatabase();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
