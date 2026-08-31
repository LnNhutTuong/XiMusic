import db from "../models/index";

afterAll(async () => {
  await db.sequelize.close();
});
