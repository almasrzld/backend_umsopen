import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class BaganService {
  async getAllBagan({ category }) {
    const where = category ? { category } : {};

    const matches = await prisma.bagan.findMany({
      where,
      orderBy: [{ round: "asc" }, { indexInRound: "asc" }],
    });

    // Ambil semua kode user yang muncul
    const userCodes = [
      ...new Set(
        matches.flatMap((m) => [m.participant1, m.participant2].filter(Boolean))
      ),
    ];

    // Ambil data peserta terkait
    const participants = await prisma.participant.findMany({
      where: { user_kode: { in: userCodes } },
      select: {
        user_kode: true,
        user_name: true,
        photo: true,
      },
    });

    const participantMap = Object.fromEntries(
      participants.map((p) => [
        p.user_kode,
        {
          nama: p.user_name,
          foto: p.photo,
        },
      ])
    );

    // Tambahkan nama peserta ke setiap match
    const matchesWithNames = matches.map((m) => ({
      ...m,
      participant1_info: m.participant1
        ? participantMap[m.participant1] ?? null
        : null,
      participant2_info: m.participant2
        ? participantMap[m.participant2] ?? null
        : null,
    }));

    return matchesWithNames;
  }

  // Ambil semua bagan berdasarkan kategori
  async getBaganByCategory(category) {
    const matches = await prisma.bagan.findMany({
      where: { category },
      orderBy: [{ round: "asc" }, { indexInRound: "asc" }],
    });

    // Ambil semua kode peserta dari participant1 dan participant2
    const userCodes = [
      ...new Set(
        matches.flatMap((m) => [m.participant1, m.participant2].filter(Boolean))
      ),
    ];

    // Ambil data peserta
    const participants = await prisma.participant.findMany({
      where: { user_kode: { in: userCodes } },
      select: {
        user_kode: true,
        user_name: true,
        photo: true,
      },
    });

    const participantMap = Object.fromEntries(
      participants.map((p) => [
        p.user_kode,
        {
          nama: p.user_name,
          foto: p.photo,
        },
      ])
    );

    // Gabungkan info peserta ke data pertandingan
    const matchesWithInfo = matches.map((m) => ({
      ...m,
      participant1_info: m.participant1
        ? participantMap[m.participant1] ?? null
        : null,
      participant2_info: m.participant2
        ? participantMap[m.participant2] ?? null
        : null,
    }));

    return matchesWithInfo;
  }

  async generateBracket(category) {
    // 1. Ambil peserta PAID dari kategori
    const participants = await prisma.participant.findMany({
      where: {
        user_category: category,
        status: "PAID",
      },
      select: {
        user_kode: true,
      },
    });

    if (participants.length < 2) {
      throw new Error("Minimal 2 peserta dibutuhkan untuk membuat bagan.");
    }

    // 2. Acak peserta
    const shuffled = participants
      .map((p) => p.user_kode)
      .sort(() => Math.random() - 0.5);

    // 3. Tambah WO jika jumlah peserta bukan kelipatan 2
    const nextPowerOfTwo = (n) => Math.pow(2, Math.ceil(Math.log2(n)));
    const totalSlot = nextPowerOfTwo(shuffled.length);
    const emptySlot = totalSlot - shuffled.length;
    for (let i = 0; i < emptySlot; i++) {
      shuffled.push(null); // null berarti WO
    }

    // 4. Buat pertandingan per ronde
    const totalRounds = Math.log2(totalSlot);
    const matches = [];
    let round = 1;
    let currentPlayers = [...shuffled];

    while (currentPlayers.length > 1) {
      const nextRound = [];
      for (let i = 0; i < currentPlayers.length; i += 2) {
        const p1 = currentPlayers[i];
        const p2 = currentPlayers[i + 1];

        matches.push({
          round,
          category,
          indexInRound: i / 2,
          participant1: p1,
          participant2: p2,
          status: "SCHEDULED",
          isSemifinal: totalRounds - round === 1,
        });

        nextRound.push(null);
      }

      currentPlayers = nextRound;
      round++;
    }

    // 5. Simpan ke DB
    await prisma.bagan.createMany({ data: matches });

    return matches;
  }

  // Update hasil pertandingan & teruskan ke ronde berikutnya
  async updateMatchResult(matchId, { score1, score2, winner, win_method }) {
    const match = await prisma.bagan.update({
      where: { id: matchId },
      data: {
        score1,
        score2,
        winner,
        win_method,
        status: "COMPLETED",
      },
    });

    await this.advanceWinnerToNextRound(match);

    if (match.isSemifinal) {
      await this.handleThirdPlaceMatch(match.category, match.round);
    }

    return match;
  }

  // Meneruskan pemenang ke babak selanjutnya
  async advanceWinnerToNextRound(match) {
    const nextMatchIndex = Math.floor(match.indexInRound / 2);
    const position =
      match.indexInRound % 2 === 0 ? "participant1" : "participant2";

    const nextMatch = await prisma.bagan.findFirst({
      where: {
        category: match.category,
        round: match.round + 1,
        isThirdPlace: false,
      },
      orderBy: { indexInRound: "asc" },
      skip: nextMatchIndex,
      take: 1,
    });

    if (!nextMatch) return;

    await prisma.bagan.update({
      where: { id: nextMatch.id },
      data: {
        [position]: match.winner,
      },
    });
  }

  async handleThirdPlaceMatch(category, semifinalRound) {
    const semifinalMatches = await prisma.bagan.findMany({
      where: {
        category,
        round: semifinalRound,
        isSemifinal: true,
      },
      orderBy: { indexInRound: "asc" },
    });

    const completed = semifinalMatches.filter((m) => m.status === "COMPLETED");
    if (completed.length < 2) return;

    const exists = await prisma.bagan.findFirst({
      where: {
        category,
        round: semifinalRound + 1,
        isThirdPlace: true,
      },
    });
    if (exists) return;

    const losers = completed.map((m) =>
      m.winner === m.participant1 ? m.participant2 : m.participant1
    );

    await prisma.bagan.create({
      data: {
        round: semifinalRound + 1,
        category,
        indexInRound: 1, // 0 = final, 1 = perebutan juara 3
        participant1: losers[0],
        participant2: losers[1],
        status: "SCHEDULED",
        isThirdPlace: true,
      },
    });
  }

  // Reset hasil pertandingan (score, winner, method, status)
  async resetMatch(id) {
    // Ambil data match yang ingin direset
    const match = await prisma.bagan.findUnique({ where: { id } });
    if (!match) throw new Error("Match tidak ditemukan");

    // Hapus data match ini
    await prisma.bagan.update({
      where: { id },
      data: {
        score1: null,
        score2: null,
        winner: null,
        win_method: null,
        status: "SCHEDULED",
      },
    });

    // Hapus pemenang dari ronde berikutnya jika sudah di-set
    const nextMatchIndex = Math.floor(match.indexInRound / 2);
    const position =
      match.indexInRound % 2 === 0 ? "participant1" : "participant2";

    const nextMatch = await prisma.bagan.findFirst({
      where: {
        category: match.category,
        round: match.round + 1,
        isThirdPlace: false,
      },
      orderBy: { indexInRound: "asc" },
      skip: nextMatchIndex,
      take: 1,
    });

    if (nextMatch && nextMatch[position] === match.winner) {
      await prisma.bagan.update({
        where: { id: nextMatch.id },
        data: {
          [position]: null,
        },
      });
    }
  }

  // !! Hapus semua bagan berdasarkan kategori
  async deleteBaganByCategory(category) {
    await prisma.bagan.deleteMany({
      where: { category },
    });
  }

  // !! Hapus semua bagan
  async deleteAllBagan() {
    await prisma.bagan.deleteMany();
  }
}

export const baganService = new BaganService();
