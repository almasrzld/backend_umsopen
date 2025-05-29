import { participantService } from "./partisipan.service.js";
import { reformParticipant } from "../../utils/reform-participant.js";

export const fetchParticipant = async (req, res) => {
  const { id } = req.params;

  const participant = await participantService.getParticipantById(id);

  if (!participant) {
    return res.status(404).json({
      status: "error",
      message: "Participant not found",
    });
  }

  res.json({
    status: "success",
    data: reformParticipant(participant),
  });
};

export const fetchParticipantsByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({
      status: "error",
      message: "Category is required",
    });
  }

  const participants = await participantService.getParticipantsByCategory(
    category
  );

  res.json({
    status: "success",
    data: participants.map(reformParticipant),
  });
};

export const fetchStatistics = async (req, res) => {
  try {
    const stats = await participantService.getStatistics();

    res.json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch statistics",
    });
  }
};

export const fetchInstitutionStats = async (req, res) => {
  try {
    const data = await participantService.getInstitutionStats();
    res
      .status(200)
      .json({ message: "Berhasil memuat statistik asal institusi", data });
  } catch (err) {
    res.status(500).json({ message: "Gagal memuat data", error: err.message });
  }
};
