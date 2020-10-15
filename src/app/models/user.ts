export interface User {
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
}
