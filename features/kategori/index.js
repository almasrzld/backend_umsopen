import { kategoriService } from "./kategori.service.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, label } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nama kategori wajib diisi" });
    }

    const newCategory = await kategoriService.createCategory({ name, label });

    return res.status(201).json({
      message: "Kategori berhasil dibuat",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error createCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get All Categories
export const getCategory = async (req, res) => {
  try {
    const categories = await kategoriService.getAllCategories();

    return res.status(200).json({
      message: "Berhasil mengambil semua kategori",
      data: categories,
    });
  } catch (error) {
    console.error("Error getCategory:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await kategoriService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil kategori",
      data: category,
    });
  } catch (error) {
    console.error("Error getCategoryById:", error);
    return res.status(500).json({ message: error.message });
  }
};
