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

export const getBaganByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Kategori wajib diisi" });
    }

    const data = await baganService.getBaganByCategory(category);

    return res.status(200).json({
      message: `Bagan kategori ${category} berhasil dimuat`,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Gagal memuat data bagan per kategori",
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

    if (!win_method || !validWinMethods.includes(win_method)) {
      return res.status(400).json({
        message: "win_method wajib diisi dan valid",
      });
    }

    if (win_method !== "DRAW" && !winner) {
      return res.status(400).json({
        message: "Winner wajib diisi kecuali hasil DRAW",
      });
    }

    if (
      win_method === "POINTS" &&
      (typeof score1 !== "number" ||
        typeof score2 !== "number" ||
        isNaN(score1) ||
        isNaN(score2))
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

    let successMessage = "Hasil pertandingan berhasil diperbarui";

    if (win_method === "DRAW") {
      successMessage =
        "Pertandingan berakhir draw, lakukan tanding ulang hingga ada pemenang";
    }

    res.status(200).json({
      message: successMessage,
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

export const resetMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await baganService.resetMatch(id);
    res.status(200).json({
      message: "Pertandingan berhasil direset",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mereset pertandingan", error: error.message });
  }
};

// Hapus bagan berdasarkan kategori
export const deleteBaganByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Kategori wajib diisi" });
    }

    await baganService.deleteBaganByCategory(category);

    res.status(200).json({
      message: `Bagan untuk kategori '${category}' berhasil dihapus.`,
    });
  } catch (error) {
    console.error("Gagal menghapus bagan:", error);
    res.status(500).json({
      message: "Gagal menghapus bagan berdasarkan kategori",
      error: error.message,
    });
  }
};

// !! Hapus semua bagan
export const deleteAllBaganHandler = async (req, res) => {
  try {
    await baganService.deleteAllBagan();
    res.status(200).json({ message: "Semua data bagan berhasil dihapus." });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus semua data bagan",
      error: error.message,
    });
  }
};
