import { prisma } from './prisma';
import { ElephantImage } from '@/types/types';
import { Elephant, Prisma } from '@prisma/client';


// Elephant database operations
export async function getElephantById(id: number): Promise<Elephant | null> {
  return await prisma.elephant.findUnique({
    where: { id }
  });
}

export async function getElephantsByElement(elementSymbol: string): Promise<Elephant[]> {
  return await prisma.elephant.findMany({
    where: { elementSymbol },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAllElephants(): Promise<Elephant[]> {
  return await prisma.elephant.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createElephant(data: Prisma.ElephantCreateInput): Promise<Elephant> {
  return await prisma.elephant.create({
    data: {
      elementSymbol: data.elementSymbol,
      imageUrl: data.imageUrl,
      blobKey: data.blobKey,
      caption: data.caption
    }
  });
}

export async function deleteElephant(id: number): Promise<void> {
  await prisma.elephant.delete({
    where: { id }
  });
}

// Convert database elephant to frontend elephant format
export function toElephantImage(elephant: Elephant): ElephantImage {
  return {
    id: elephant.id,
    imageUrl: elephant.imageUrl,
    caption: elephant.caption,
    blobKey: elephant.blobKey,
    createdAt: elephant.createdAt,
  };
}