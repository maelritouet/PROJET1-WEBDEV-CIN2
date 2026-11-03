import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../types/express';

export interface IUser {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  role: UserRole;
  associationId?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'responsable', 'etudiant'],
      default: 'etudiant',
    },
    associationId: { type: Schema.Types.ObjectId, ref: 'Association' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
