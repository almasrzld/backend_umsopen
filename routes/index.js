import express from "express";
import authRoutes from "./auth.routes.js";
import kategoriRoutes from "./kategori.route.js";
import pendaftaranRoutes from "./pendaftaran.routes.js";
import partisipanRoutes from "./partisipan.routes.js";
import baganRoutes from "./bagan.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// auth
router.use("/v1/api/auth", authRoutes);

// kategori
router.use("/v1/api/kategori", kategoriRoutes);

// pendaftaran
router.use("/v1/api/pendaftaran", pendaftaranRoutes);

// partisipan
router.use("/v1/api/partisipan", partisipanRoutes);

// bagan
router.use("/v1/api/bagan", baganRoutes);

export default router;
