export const reformParticipant = (participant) => {
  return {
    id: participant.id,
    user_kode: participant.user_kode,
    orderId: participant.orderId,
    user_name: participant.user_name,
    user_email: participant.user_email,
    user_phone: participant.user_phone,
    category: {
      id: participant.category?.id,
      name: participant.category?.name,
      label: participant.category?.label,
    },
    user_institution: participant.user_institution,
    user_message: participant.user_message,
    status: participant.status,
    photo: participant.photo,
    snap_token: participant.snap_token,
    snap_redirect_url: participant.snap_redirect_url,
    createdAt: participant.createdAt,
  };
};
