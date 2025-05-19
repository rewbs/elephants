-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "elephantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Story_elephantId_idx" ON "Story"("elephantId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_elephantId_fkey" FOREIGN KEY ("elephantId") REFERENCES "Elephant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
