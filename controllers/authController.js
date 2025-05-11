const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashed });
    await newAdmin.save();

    res.status(201).json({ message: "Admin berhasil dibuat" });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat admin" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login berhasil", data: { token } });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

// ME
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data admin" });
  }
};

module.exports = { register, login, getMe };
