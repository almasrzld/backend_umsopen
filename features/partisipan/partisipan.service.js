import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ParticipantService {
  async getStatistics() {
    const participants = await prisma.participant.count({
      where: { status: "PAID" },
    });

    const categories = await prisma.participant.groupBy({
      by: ["user_category"],
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
    });
  }

  async getParticipantsByCategory(category) {
    return prisma.participant.findMany({
      where: { user_category: category },
    });
  }
}

export const participantService = new ParticipantService();
