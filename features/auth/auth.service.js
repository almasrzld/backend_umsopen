import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

class AuthService {
  async register({ email, username, password }) {
    const existing = await prisma.admin.findUnique({ where: { email } });

    if (existing) {
      const error = new Error("Admin sudah terdaftar");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.create({
      data: {
        email,
        username,
        password: hashedPassword,
        v: 0,
      },
    });

    return { message: "Admin berhasil dibuat" };
  }

  async login({ email, password }) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      const error = new Error("Email tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      const error = new Error("Password salah");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      message: "Login berhasil",
      data: {
        token,
      },
    };
  }

  async getMe({ id }) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!admin) {
      const error = new Error("Admin tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return admin;
  }

  async deleteAdmin({ id }) {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      const error = new Error("Admin tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    await prisma.admin.delete({ where: { id } });
    return { message: "Admin berhasil dihapus" };
  }
}

export const authService = new AuthService();
