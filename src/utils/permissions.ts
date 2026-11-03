interface SessionUser {
  role: 'admin' | 'responsable' | 'etudiant';
  associationId?: string;
}

export const canManageAssociation = (
  user: SessionUser,
  associationId: string | undefined
): boolean => {
  if (user.role === 'admin') {
    return true;
  }

  return user.role === 'responsable' && Boolean(user.associationId) && user.associationId === associationId;
};
