import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { asEmail, asString } from '../utils/validation';

export const register = async (req: Request, res: Response) => {
  const prenom = asString(req.body.prenom);
  const nom = asString(req.body.nom);
  const email = asEmail(req.body.email);
  const password = asString(req.body.password);
  if (!prenom || !nom || !email || !password) {
    return res.status(400).json({ message: 'Champs invalides.' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email déjà utilisé.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ prenom, nom, email, password: hashed });

  req.session.user = { id: user.id, role: user.role, associationId: user.associationId?.toString() };

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
};

export const login = async (req: Request, res: Response) => {
  const email = asEmail(req.body.email);
  const password = asString(req.body.password);
  if (!email || !password) {
    return res.status(400).json({ message: 'Identifiants invalides.' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Identifiants invalides.' });
  }

  req.session.user = { id: user.id, role: user.role, associationId: user.associationId?.toString() };

  return res.json({ id: user.id, email: user.email, role: user.role });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur de déconnexion.' });
    }

    return res.status(204).send();
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Authentification requise.' });
  }

  const user = await User.findById(req.session.user.id).select('-password');
  return res.json(user);
};

export const getCsrfToken = (req: Request, res: Response) => {
  return res.json({ csrfToken: req.session.csrfToken });
};
