-- CreateTable
CREATE TABLE "Elephant" (
    "id" SERIAL NOT NULL,
    "elementSymbol" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "blobKey" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elephant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Elephant_elementSymbol_idx" ON "Elephant"("elementSymbol");
