import express from "express";
import authRoutes from "./auth.routes.js";
import pendaftaranRoutes from "./pendaftaran.routes.js";
import partisipanRoutes from "./partisipan.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// auth
router.use("/v1/api/auth", authRoutes);

// pendaftaran
router.use("/v1/api/pendaftaran", pendaftaranRoutes);

// partisipan
router.use("/v1/api/partisipan", partisipanRoutes);

export default router;
