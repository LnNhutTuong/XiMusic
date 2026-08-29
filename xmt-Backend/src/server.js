import express from "express";
import path from "path";
import initApiRoutes from "./routes/api";
import configViewEngine from "./configs/viewEngine";
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8081;
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import configCors from "./configs/cors";
const db = require("./models/index");

//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie parser
app.use(cookieParser());

//config cors
configCors(app);

// serve uploaded files
app.use("/uploads", express.static("uploads"));

//test connection
const connectionDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
connectionDB();

console.log("name: ", process.env.DB_NAME);

//init api routes
initApiRoutes(app);

app.use((req, res) => {
  return res.send("Connect Successfully");
});

app.listen(PORT, () => {
  console.log(">>>> JWT Backend is running on PORT = " + PORT);
});
