import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { canManageAssociation } from '../utils/permissions';
import { asObjectId, asString, escapeRegex } from '../utils/validation';

export const createEvent = async (req: Request, res: Response) => {
  const user = req.session.user!;
  const associationId = asObjectId(req.body.associationId);
  const titre = asString(req.body.titre);
  const description = asString(req.body.description);
  const lieu = asString(req.body.lieu);
  const categorie = asString(req.body.categorie);
  const date = req.body.date ? new Date(req.body.date) : null;
  const capacite = Number(req.body.capacite);

  if (!associationId || !titre || !description || !lieu || !categorie || !date || Number.isNaN(date.getTime()) || !Number.isInteger(capacite) || capacite < 1) {
    return res.status(400).json({ message: 'Champs invalides.' });
  }

  if (!canManageAssociation(user, associationId)) {
    return res.status(403).json({ message: 'Droits insuffisants pour créer un événement pour cette association.' });
  }

  const event = await Event.create({
    associationId,
    titre,
    description,
    lieu,
    categorie,
    date,
    capacite,
    publie: Boolean(req.body.publie),
  });
  res.status(201).json(event);
};

export const listEvents = async (req: Request, res: Response) => {
  const { categorie, associationId, q, publishedOnly } = req.query;
  const filter: Record<string, unknown> = {};

  if (typeof categorie === 'string') {
    filter.categorie = categorie.trim();
  }

  if (typeof associationId === 'string') {
    const safeAssociationId = asObjectId(associationId);
    if (!safeAssociationId) {
      return res.status(400).json({ message: 'Association invalide.' });
    }

    filter.associationId = safeAssociationId;
  }

  if (publishedOnly === 'true') {
    filter.publie = true;
  }

  if (typeof q === 'string') {
    const safeQuery = escapeRegex(q.trim());
    filter.$or = [
      { titre: { $regex: safeQuery, $options: 'i' } },
      { description: { $regex: safeQuery, $options: 'i' } },
      { lieu: { $regex: safeQuery, $options: 'i' } },
    ];
  }

  const events = await Event.find(filter).sort({ date: 1 });
  res.json(events);
};

export const getEvent = async (req: Request, res: Response) => {
  const eventId = asObjectId(req.params.id);
  if (!eventId) {
    return res.status(400).json({ message: 'Événement invalide.' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Événement introuvable.' });
  }

  res.json(event);
};

export const updateEvent = async (req: Request, res: Response) => {
  const eventId = asObjectId(req.params.id);
  if (!eventId) {
    return res.status(400).json({ message: 'Événement invalide.' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Événement introuvable.' });
  }

  const user = req.session.user!;
  if (!canManageAssociation(user, event.associationId.toString())) {
    return res.status(403).json({ message: 'Droits insuffisants pour modifier cet événement.' });
  }

  const associationId = asObjectId(req.body.associationId);
  const payload: Record<string, unknown> = {
    titre: asString(req.body.titre) ?? undefined,
    description: asString(req.body.description) ?? undefined,
    lieu: asString(req.body.lieu) ?? undefined,
    categorie: asString(req.body.categorie) ?? undefined,
    associationId: associationId ?? undefined,
    publie: typeof req.body.publie === 'boolean' ? req.body.publie : undefined,
  };
  if (req.body.date) {
    const date = new Date(req.body.date);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Date invalide.' });
    }

    payload.date = date;
  }
  if (req.body.capacite !== undefined) {
    const capacity = Number(req.body.capacite);
    if (!Number.isInteger(capacity) || capacity < 1) {
      return res.status(400).json({ message: 'Capacité invalide.' });
    }
    payload.capacite = capacity;
  }
  if (associationId && !canManageAssociation(user, associationId)) {
    return res.status(403).json({ message: 'Droits insuffisants pour changer l’association de cet événement.' });
  }

  Object.assign(event, payload);
  await event.save();

  res.json(event);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const eventId = asObjectId(req.params.id);
  if (!eventId) {
    return res.status(400).json({ message: 'Événement invalide.' });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Événement introuvable.' });
  }

  const user = req.session.user!;
  if (!canManageAssociation(user, event.associationId.toString())) {
    return res.status(403).json({ message: 'Droits insuffisants pour supprimer cet événement.' });
  }

  await event.deleteOne();
  res.status(204).send();
};
