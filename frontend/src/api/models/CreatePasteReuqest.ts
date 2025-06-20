export interface CreatePasteRequest {
  title?: string;
  content: string;
  language: string;
  expiration: number;
  isPrivate: boolean;
}
