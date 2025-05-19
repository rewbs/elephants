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

export interface Story {
  id?: number;
  content: string;
  elephantId: number;
  createdAt?: Date;
}

export interface ElephantImage {
  id?: number;
  imageUrl: string;
  caption: string;
  blobKey?: string;
  createdAt?: Date;
  stories?: Story[];
}

export interface ElementWithImage extends Element {
  elephants: ElephantImage[];
}

export type ElephantImagesMap = {
  [key: string]: ElephantImage[];
};