import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { startCleanupJob } from "./utils/cron-participant.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

startCleanupJob();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
