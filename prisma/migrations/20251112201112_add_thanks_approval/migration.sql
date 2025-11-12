-- AlterTable
ALTER TABLE "thanks" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "thanks_isApproved_idx" ON "thanks"("isApproved");
