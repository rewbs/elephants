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
  imageUrl: string;
  caption: string;
}

export interface ElementWithImage extends Element {
  elephant?: ElephantImage;
}

export type ElephantImagesMap = {
  [key: string]: ElephantImage;
};