import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function startCleanupJob() {
  cron.schedule("0 * * * *", async () => {
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const result = await prisma.participant.deleteMany({
        where: {
          status: {
            not: "PAID",
          },
          createdAt: {
            lt: expiredDate,
          },
        },
      });

      console.log(
        `[CleanupJob] Deleted ${result.count} expired unpaid participants`
      );
    } catch (error) {
      console.error("[CleanupJob] Error deleting expired participants:", error);
    }
  });
}
