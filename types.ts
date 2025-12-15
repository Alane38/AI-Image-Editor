export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface HistoryItem {
  image: ImageFile;
  prompt: string | null; // Null for the original uploaded image
}
