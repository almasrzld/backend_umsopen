import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ParticipantService {
  async getParticipantById(id) {
    return prisma.participant.findUnique({
      where: { id },
    });
  }
}

export const participantService = new ParticipantService();
