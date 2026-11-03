export const canRegisterToEvent = (args: {
  alreadyRegistered: boolean;
  confirmedRegistrations: number;
  capacity: number;
}) => {
  if (args.alreadyRegistered) {
    return { ok: false, error: "Vous êtes déjà inscrit à cet événement." };
  }

  if (args.confirmedRegistrations >= args.capacity) {
    return { ok: false, error: "La capacité maximale de l'événement est atteinte." };
  }

  return { ok: true };
};
