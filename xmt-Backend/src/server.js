import app from "./app";
require("dotenv").config();
const PORT = process.env.PORT || 8081;

const db = require("./models/index");

//test connection
const connectionDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(">>>>>>>Connection has been established successfully.<<<<<<");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectionDB();

app.listen(PORT, () => {
  console.log(">>>>>>> JWT Backend is running on PORT = " + PORT);
});
