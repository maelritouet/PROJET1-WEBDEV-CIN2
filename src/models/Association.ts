import mongoose, { Schema } from 'mongoose';

export interface IAssociation {
  nom: string;
  description: string;
  contact: string;
  logo?: string;
  actif: boolean;
}

const associationSchema = new Schema<IAssociation>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    logo: { type: String, trim: true },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Association = mongoose.model<IAssociation>('Association', associationSchema);
