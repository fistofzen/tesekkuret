-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "applicationData" JSONB,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "companies_isApproved_idx" ON "companies"("isApproved");
