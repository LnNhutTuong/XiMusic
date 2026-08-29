"use strict";

var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _api = _interopRequireDefault(require("./routes/api"));
var _viewEngine = _interopRequireDefault(require("./configs/viewEngine"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("./configs/cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
require("dotenv").config();
const app = (0, _express.default)();
const PORT = process.env.PORT || 8081;
const db = require("./models/index");

//config view engine
(0, _viewEngine.default)(app);

//config body parser
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));

//config cookie parser
app.use((0, _cookieParser.default)());

//config cors
(0, _cors.default)(app);

// serve uploaded files
app.use("/uploads", _express.default.static("uploads"));

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
(0, _api.default)(app);
app.use((req, res) => {
  return res.send("Connect Successfully");
});
app.listen(PORT, () => {
  console.log(">>>> JWT Backend is running on PORT = " + PORT);
});