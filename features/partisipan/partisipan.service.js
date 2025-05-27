import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ParticipantService {
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
