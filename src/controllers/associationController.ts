import { Request, Response } from 'express';
import { Association } from '../models/Association';
import { canManageAssociation } from '../utils/permissions';
import { asObjectId, asString } from '../utils/validation';

export const createAssociation = async (req: Request, res: Response) => {
  const nom = asString(req.body.nom);
  const description = asString(req.body.description);
  const contact = asString(req.body.contact);
  const logo = asString(req.body.logo) ?? undefined;
  if (!nom || !description || !contact) {
    return res.status(400).json({ message: 'Champs invalides.' });
  }

  const association = await Association.create({ nom, description, contact, logo, actif: req.body.actif });
  res.status(201).json(association);
};

export const listAssociations = async (_req: Request, res: Response) => {
  const associations = await Association.find();
  res.json(associations);
};

export const getAssociation = async (req: Request, res: Response) => {
  const associationId = asObjectId(req.params.id);
  if (!associationId) {
    return res.status(400).json({ message: 'Association invalide.' });
  }

  const association = await Association.findById(associationId);
  if (!association) {
    return res.status(404).json({ message: 'Association introuvable.' });
  }

  res.json(association);
};

export const updateAssociation = async (req: Request, res: Response) => {
  const user = req.session.user!;
  const associationId = asObjectId(req.params.id);
  if (!associationId) {
    return res.status(400).json({ message: 'Association invalide.' });
  }

  if (!canManageAssociation(user, associationId)) {
    return res.status(403).json({ message: 'Droits insuffisants pour modifier cette association.' });
  }

  const updates = {
    nom: asString(req.body.nom) ?? undefined,
    description: asString(req.body.description) ?? undefined,
    contact: asString(req.body.contact) ?? undefined,
    logo: asString(req.body.logo) ?? undefined,
    actif: typeof req.body.actif === 'boolean' ? req.body.actif : undefined,
  };

  const association = await Association.findByIdAndUpdate(associationId, updates, { new: true });
  if (!association) {
    return res.status(404).json({ message: 'Association introuvable.' });
  }

  res.json(association);
};

export const deleteAssociation = async (req: Request, res: Response) => {
  const user = req.session.user!;
  const associationId = asObjectId(req.params.id);
  if (!associationId) {
    return res.status(400).json({ message: 'Association invalide.' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Seul un administrateur peut supprimer une association.' });
  }

  const association = await Association.findByIdAndDelete(associationId);
  if (!association) {
    return res.status(404).json({ message: 'Association introuvable.' });
  }

  res.status(204).send();
};
