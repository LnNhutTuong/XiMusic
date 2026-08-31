import request from "supertest";
import app from "../app.js";

test("Test API get all song public EC:200", async () => {
  const res = await request(app).get("/api/v1/song").query({
    page: 1,
    limit: 10,
  });

  (console.log(">>>check status: ", res.statusCode),
    console.log(">>>check body: ", res.body));
  expect(res.statusCode).toBe(200);
});
