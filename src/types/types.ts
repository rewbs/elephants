export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  category: string;
  group: number;
  period: number;
  block: string;
  electronConfiguration: string;
  xPos: number;
  yPos: number;
}

export interface ElephantImage {
  id?: number;
  imageUrl: string;
  caption: string;
  blobKey?: string;
  createdAt?: Date;
}

export interface ElementWithImage extends Element {
  elephants: ElephantImage[];
}

export type ElephantImagesMap = {
  [key: string]: ElephantImage[];
};