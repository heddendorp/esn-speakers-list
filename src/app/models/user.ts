export interface User {
  id: string;
  roles: string[];
  hasAccess: boolean;
  country: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  isCt: boolean;
  uid: string;
  section: string;
  sectionId: string;
  photoURL: string;
  votes: number;
  selectedRole?: number;
  selectedRoleText?: string;
  hidePersonalData?: boolean;
}
