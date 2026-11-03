import mongoose, { Schema } from 'mongoose';

export interface IEvent {
  titre: string;
  description: string;
  date: Date;
  lieu: string;
  capacite: number;
  categorie: string;
  associationId: mongoose.Types.ObjectId;
  publie: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    lieu: { type: String, required: true, trim: true },
    capacite: { type: Number, required: true, min: 1 },
    categorie: { type: String, required: true, trim: true },
    associationId: { type: Schema.Types.ObjectId, ref: 'Association', required: true },
    publie: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
