import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class KategoriService {
  // ✅ Create Category
  async createCategory({ name, label }) {
    const category = await prisma.category.create({
      data: {
        name,
        label,
      },
    });
    return category;
  }

  // ✅ Get All Categories
  async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        participants: true,
      },
      orderBy: { createdAt: "asc" },
    });
    return categories;
  }

  // ✅ Get Category by ID
  async getCategoryById(id) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    return category;
  }
}

export const kategoriService = new KategoriService();
