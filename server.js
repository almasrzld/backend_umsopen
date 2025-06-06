import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { startCleanupJob } from "./utils/cron-participant.js";

const app = express();
const PORT = process.env.PORT || 3000;

startCleanupJob();

app.use(express.json());
app.use(cors());

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
