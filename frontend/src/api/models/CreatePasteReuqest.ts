export interface CreatePasteRequest {
  title?: string;
  content: string;
  syntax: string;
  expiration: number;
  isPrivate: boolean;
}
