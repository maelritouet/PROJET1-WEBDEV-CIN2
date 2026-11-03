import 'express-session';

export type UserRole = 'admin' | 'responsable' | 'etudiant';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      role: UserRole;
      associationId?: string;
    };
    csrfToken?: string;
  }
}
