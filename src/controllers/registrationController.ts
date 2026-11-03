import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Event } from '../models/Event';
import { Registration } from '../models/Registration';
import { canRegisterToEvent } from '../utils/registrationRules';
import { canManageAssociation } from '../utils/permissions';
import { asObjectId } from '../utils/validation';

export const createRegistration = async (req: Request, res: Response) => {
  const userId = req.session.user!.id;
  const eventId = asObjectId(req.body.eventId);

  if (!eventId || !mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: "L'événement est invalide." });
  }

  const event = await Event.findById(eventId);
  if (!event || !event.publie) {
    return res.status(404).json({ message: 'Événement introuvable ou non publié.' });
  }

  const [alreadyRegistered, confirmedCount] = await Promise.all([
    Registration.exists({ userId, eventId }),
    Registration.countDocuments({ eventId, statut: 'confirmee' }),
  ]);

  const registrationCheck = canRegisterToEvent({
    alreadyRegistered: Boolean(alreadyRegistered),
    confirmedRegistrations: confirmedCount,
    capacity: event.capacite,
  });

  if (!registrationCheck.ok) {
    return res.status(409).json({ message: registrationCheck.error });
  }

  const registration = await Registration.create({ userId, eventId });
  return res.status(201).json(registration);
};

export const listRegistrations = async (req: Request, res: Response) => {
  const user = req.session.user!;

  if (user.role === 'admin') {
    const registrations = await Registration.find().populate('userId eventId');
    return res.json(registrations);
  }

  if (user.role === 'responsable') {
    const registrations = await Registration.find()
      .populate({ path: 'eventId', match: { associationId: user.associationId } })
      .populate('userId');

    return res.json(registrations.filter((registration) => registration.eventId));
  }

  const registrations = await Registration.find({ userId: user.id }).populate('eventId');
  return res.json(registrations);
};

export const getRegistration = async (req: Request, res: Response) => {
  const registrationId = asObjectId(req.params.id);
  if (!registrationId) {
    return res.status(400).json({ message: 'Inscription invalide.' });
  }

  const registration = await Registration.findById(registrationId).populate('eventId userId');
  if (!registration) {
    return res.status(404).json({ message: 'Inscription introuvable.' });
  }

  const user = req.session.user!;
  const isOwner = registration.userId.toString() === user.id;
  const eventAssociationId = (registration.eventId as unknown as { associationId: mongoose.Types.ObjectId }).associationId?.toString();
  const canManagerView = canManageAssociation(user, eventAssociationId);

  if (user.role !== 'admin' && !isOwner && !canManagerView) {
    return res.status(403).json({ message: 'Droits insuffisants pour consulter cette inscription.' });
  }

  return res.json(registration);
};

export const cancelRegistration = async (req: Request, res: Response) => {
  const registrationId = asObjectId(req.params.id);
  if (!registrationId) {
    return res.status(400).json({ message: 'Inscription invalide.' });
  }

  const registration = await Registration.findById(registrationId).populate('eventId');
  if (!registration) {
    return res.status(404).json({ message: 'Inscription introuvable.' });
  }

  const user = req.session.user!;
  const isOwner = registration.userId.toString() === user.id;
  const eventAssociationId = (registration.eventId as unknown as { associationId: mongoose.Types.ObjectId }).associationId?.toString();
  const canManagerCancel = canManageAssociation(user, eventAssociationId);

  if (!isOwner && !canManagerCancel) {
    return res.status(403).json({ message: 'Droits insuffisants pour annuler cette inscription.' });
  }

  registration.statut = 'annulee';
  await registration.save();

  return res.json(registration);
};

export const deleteRegistration = async (req: Request, res: Response) => {
  const registrationId = asObjectId(req.params.id);
  if (!registrationId) {
    return res.status(400).json({ message: 'Inscription invalide.' });
  }

  const registration = await Registration.findById(registrationId).populate('eventId');
  if (!registration) {
    return res.status(404).json({ message: 'Inscription introuvable.' });
  }

  const user = req.session.user!;
  const eventAssociationId = (registration.eventId as unknown as { associationId: mongoose.Types.ObjectId }).associationId?.toString();

  if (user.role !== 'admin' && !canManageAssociation(user, eventAssociationId)) {
    return res.status(403).json({ message: 'Droits insuffisants pour supprimer cette inscription.' });
  }

  await registration.deleteOne();
  return res.status(204).send();
};
