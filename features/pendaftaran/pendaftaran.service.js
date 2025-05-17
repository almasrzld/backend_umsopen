import { PrismaClient } from "@prisma/client";
// import { PENDING_PAYMENT } from "../../utils/constant.js";

const prisma = new PrismaClient();

class ParticipantService {
  async generateUserCodeAndOrderId() {
    const counter = await prisma.counter.upsert({
      where: { name: "participant" },
      create: { name: "participant", seq: 1, v: 0 },
      update: { seq: { increment: 1 } },
    });

    const user_kode = `UMS2025-${String(counter.seq).padStart(4, "0")}`;
    const orderId = `ORD-${Date.now()}`;

    return { user_kode, orderId };
  }

  async createParticipant({
    user_kode,
    orderId,
    user_name,
    user_email,
    user_phone,
    user_category,
    user_institution,
    user_message,
    status,
    snap_token = null,
    snap_redirect_url = null,
    v = 0,
  }) {
    return prisma.participant.create({
      data: {
        user_kode,
        orderId,
        user_name,
        user_email,
        user_phone,
        user_category,
        user_institution,
        user_message,
        status,
        snap_token,
        snap_redirect_url,
        v,
      },
    });
  }

  async getTransactions({ status }) {
    let where = {};
    if (status) {
      where = {
        status,
      };
    }
    return prisma.participant.findMany({
      where,
    });
  }

  async getTransactionById({ orderId }) {
    return prisma.participant.findFirst({
      where: {
        orderId: orderId,
      },
    });
  }

  async updateTransactionStatus({ orderId, status }) {
    return prisma.participant.updateMany({
      where: {
        orderId: orderId,
      },
      data: {
        status,
      },
    });
  }
}

export const participantService = new ParticipantService();
