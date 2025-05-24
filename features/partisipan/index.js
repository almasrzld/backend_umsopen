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
