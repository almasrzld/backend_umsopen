import { baganService } from "./bagan.service.js";

export const getBagan = async (req, res) => {
  try {
    const { category } = req.query;

    const data = await baganService.getAllBagan({ category });

    return res.status(200).json({
      message: "Data bagan berhasil dimuat",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal memuat data bagan",
      error: err.message,
    });
  }
};

export const createBagan = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Kategori wajib diisi" });
    }

    const data = await baganService.generateBracket(category);

    return res.status(201).json({
      message: "Bagan berhasil dibuat",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal membuat bagan",
      error: err.message,
    });
  }
};

export const updateMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { score1, score2, winner, win_method } = req.body;

    const validWinMethods = ["POINTS", "KO", "WO", "DRAW"];

    // Validasi input
    if (!winner || !win_method || !validWinMethods.includes(win_method)) {
      return res.status(400).json({
        message: "Winner dan win_method wajib diisi dan valid",
      });
    }

    // score bisa optional jika WO/KO/DRAW
    if (
      win_method === "POINTS" &&
      (typeof score1 !== "number" || typeof score2 !== "number")
    ) {
      return res.status(400).json({
        message: "Score1 dan Score2 wajib diisi untuk kemenangan POINTS",
      });
    }

    const updatedMatch = await baganService.updateMatchResult(id, {
      score1: score1 ?? null,
      score2: score2 ?? null,
      winner,
      win_method,
    });

    res.status(200).json({
      message: "Hasil pertandingan berhasil diperbarui",
      data: updatedMatch,
    });
  } catch (error) {
    console.error("Update match result error:", error);
    res.status(500).json({
      message: "Gagal memperbarui hasil pertandingan",
      error: error.message,
    });
  }
};

// !! Hapus semua bagan
export const deleteAllBaganHandler = async (req, res) => {
  await baganService.deleteAllBagan();
  res.json({ message: "Semua data bagan berhasil dihapus." });
};
