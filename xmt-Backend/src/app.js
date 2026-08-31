import express from "express";
import initApiRoutes from "./routes/api";
import configViewEngine from "./configs/viewEngine";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import configCors from "./configs/cors";

const app = express();

// config view engine
configViewEngine(app);

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie parser
app.use(cookieParser());

// config cors
configCors(app);

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// init api routes
initApiRoutes(app);

app.use((req, res) => {
  return res.send(
    "--------------------------Connect Successfully------------------------",
  );
});

export default app;
