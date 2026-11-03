import { describe, expect, it } from 'vitest';
import { canManageAssociation } from '../src/utils/permissions';

describe('canManageAssociation', () => {
  it('allows admin to manage any association', () => {
    expect(canManageAssociation({ role: 'admin' }, 'abc')).toBe(true);
  });

  it('allows responsable to manage only its own association', () => {
    expect(canManageAssociation({ role: 'responsable', associationId: 'a1' }, 'a1')).toBe(true);
    expect(canManageAssociation({ role: 'responsable', associationId: 'a1' }, 'a2')).toBe(false);
  });

  it('disallows student', () => {
    expect(canManageAssociation({ role: 'etudiant' }, 'a1')).toBe(false);
  });
});
