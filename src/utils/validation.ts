import mongoose from 'mongoose';

export const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const asEmail = (value: unknown): string | null => {
  const email = asString(value)?.toLowerCase();
  if (!email) {
    return null;
  }

  const parts = email.split('@');
  if (
    parts.length !== 2 ||
    parts[0].length === 0 ||
    parts[1].length < 3 ||
    parts[1].startsWith('.') ||
    !parts[1].includes('.')
  ) {
    return null;
  }

  return email;
};

export const asObjectId = (value: unknown): string | null => {
  if (typeof value !== 'string' || !mongoose.isValidObjectId(value)) {
    return null;
  }

  return value;
};

export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
