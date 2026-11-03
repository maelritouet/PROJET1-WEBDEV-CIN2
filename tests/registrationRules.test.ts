import { describe, expect, it } from 'vitest';
import { canRegisterToEvent } from '../src/utils/registrationRules';

describe('canRegisterToEvent', () => {
  it('blocks duplicate registrations', () => {
    const result = canRegisterToEvent({ alreadyRegistered: true, confirmedRegistrations: 0, capacity: 10 });
    expect(result).toEqual({ ok: false, error: "Vous êtes déjà inscrit à cet événement." });
  });

  it('blocks when capacity reached', () => {
    const result = canRegisterToEvent({ alreadyRegistered: false, confirmedRegistrations: 10, capacity: 10 });
    expect(result).toEqual({ ok: false, error: "La capacité maximale de l'événement est atteinte." });
  });

  it('allows valid registration', () => {
    const result = canRegisterToEvent({ alreadyRegistered: false, confirmedRegistrations: 9, capacity: 10 });
    expect(result).toEqual({ ok: true });
  });
});
