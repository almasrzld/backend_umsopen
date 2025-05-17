export const reformParticipant = (participant) => {
  return {
    id: participant.id,
    user_kode: participant.user_kode,
    orderId: participant.orderId,
    user_name: participant.user_name,
    user_email: participant.user_email,
    user_phone: participant.user_phone,
    user_category: participant.user_category,
    user_institution: participant.user_institution,
    user_message: participant.user_message,
    status: participant.status,
    snap_token: participant.snap_token,
    snap_redirect_url: participant.snap_redirect_url,
    createdAt: participant.createdAt,
  };
};
