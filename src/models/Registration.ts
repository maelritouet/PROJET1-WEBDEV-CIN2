import mongoose, { Schema } from 'mongoose';

export interface IRegistration {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  statut: 'confirmee' | 'annulee';
}

const registrationSchema = new Schema<IRegistration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    statut: {
      type: String,
      enum: ['confirmee', 'annulee'],
      default: 'confirmee',
    },
  },
  { timestamps: true }
);

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const Registration = mongoose.model<IRegistration>('Registration', registrationSchema);
