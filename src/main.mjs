import express from "express";
import { apiRouter } from "./API/Router.mjs";
import swaggerUi from "swagger-ui-express";
import swagDocs from "../swagger.json" assert { type: "json" };
const port = 3000;
const app = express();

app.use("/api/v1", apiRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagDocs));

app.listen(port, () => {
  console.clear();
  console.log(`start serve at http://localhost:${port}`);
});
