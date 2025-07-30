import { PrismaClient } from "@prisma/client";

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
    categoryId = null,
    user_institution,
    photo,
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
        categoryId,
        user_institution,
        photo,
        user_message,
        status,
        snap_token,
        snap_redirect_url,
        v,
      },
    });
  }

  async getTransactions({ page = 1, limit = 10, search = "", status }) {
    const where = {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { user_name: { contains: search, mode: "insensitive" } },
              { user_email: { contains: search, mode: "insensitive" } },
              { user_institution: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.participant.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      }),
      prisma.participant.count({ where }),
    ]);

    return { data, total };
  }

  async getTransactionById({ orderId }) {
    return prisma.participant.findFirst({
      where: {
        orderId: orderId,
      },
      include: {
        category: true,
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
