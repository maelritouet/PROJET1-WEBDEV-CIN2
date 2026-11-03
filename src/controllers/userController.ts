import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { asEmail, asObjectId, asString } from '../utils/validation';

export const createUser = async (req: Request, res: Response) => {
  const password = asString(req.body.password);
  const prenom = asString(req.body.prenom);
  const nom = asString(req.body.nom);
  const email = asEmail(req.body.email);
  if (!password || !prenom || !nom || !email) {
    return res.status(400).json({ message: 'Champs invalides.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const role =
    req.body.role && ['admin', 'responsable', 'etudiant'].includes(req.body.role)
      ? req.body.role
      : 'etudiant';
  let associationId: string | undefined;
  if (req.body.associationId !== undefined) {
    const parsedAssociationId = asObjectId(req.body.associationId);
    if (!parsedAssociationId) {
      return res.status(400).json({ message: 'Association invalide.' });
    }
    associationId = parsedAssociationId;
  }

  const user = await User.create({
    prenom,
    nom,
    email,
    role,
    associationId,
    password: hashed,
  });
  res.status(201).json({ id: user._id });
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const userId = asObjectId(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: 'Utilisateur invalide.' });
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
  }

  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = asObjectId(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: 'Utilisateur invalide.' });
  }

  const updates: Record<string, unknown> = {};
  if (req.body.email !== undefined) {
    const email = asEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: 'Email invalide.' });
    }
    updates.email = email;
  }
  if (req.body.prenom !== undefined) {
    const prenom = asString(req.body.prenom);
    if (!prenom) {
      return res.status(400).json({ message: 'Prénom invalide.' });
    }
    updates.prenom = prenom;
  }
  if (req.body.nom !== undefined) {
    const nom = asString(req.body.nom);
    if (!nom) {
      return res.status(400).json({ message: 'Nom invalide.' });
    }
    updates.nom = nom;
  }
  if (req.body.role !== undefined) {
    if (!['admin', 'responsable', 'etudiant'].includes(req.body.role)) {
      return res.status(400).json({ message: 'Rôle invalide.' });
    }
    updates.role = req.body.role;
  }
  if (req.body.associationId !== undefined) {
    const associationId = asObjectId(req.body.associationId);
    if (!associationId) {
      return res.status(400).json({ message: 'Association invalide.' });
    }
    updates.associationId = associationId;
  }
  if (req.body.password !== undefined) {
    const password = asString(req.body.password);
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe invalide.' });
    }
    updates.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
  }

  Object.assign(user, updates);
  await user.save();

  const safeUser = await User.findById(userId).select('-password');
  res.json(safeUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = asObjectId(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: 'Utilisateur invalide.' });
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur introuvable.' });
  }

  res.status(204).send();
};
