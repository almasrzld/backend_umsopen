import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ParticipantService {
  async getAllParticipants() {
    return prisma.participant.findMany({
      orderBy: { createdAt: "asc" },
      include: { category: true },
    });
  }

  async getParticipantsByStatus(status) {
    return prisma.participant.findMany({
      where: {
        status,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getStatistics() {
    const participants = await prisma.participant.count({
      where: { status: "PAID" },
    });

    const categories = await prisma.participant.groupBy({
      by: ["categoryId"],
      _count: true,
    });

    return {
      participants,
      categories: categories.length,
    };
  }

  async getParticipantById(id) {
    return prisma.participant.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getParticipantsByCategory(categoryId) {
    return prisma.participant.findMany({
      where: { categoryId, status: "PAID" },
      include: { category: true },
    });
  }

  async getInstitutionStats() {
    const result = await prisma.participant.groupBy({
      by: ["user_institution"],
      _count: true,
      where: {
        status: "PAID",
      },
    });

    const sorted = result
      .map((item) => ({
        name: item.user_institution || "Tidak Diketahui",
        count: item._count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return sorted;
  }

  async deleteParticipantById(id) {
    return prisma.participant.delete({
      where: { id },
    });
  }

  // !! Hati-hati, fungsi ini akan menghapus semua data peserta
  async deleteAllParticipants() {
    // 1. Hapus semua data peserta
    await prisma.participant.deleteMany({});

    // 2. Reset counter untuk user_kode
    await prisma.counter.update({
      where: { name: "participant" },
      data: { seq: 1 },
    });
  }
}

export const participantService = new ParticipantService();
