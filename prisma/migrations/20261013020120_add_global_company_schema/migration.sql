/*
  Warnings:

  - Added the required column `city` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'GBP', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'INR', 'PKR', 'NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'JPY', 'CNY', 'AUD', 'CAD', 'BRL', 'MXN');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('ROUTINE', 'IMPORTANT', 'URGENT', 'IMMEDIATE');

-- DropIndex
DROP INDEX "Job_location_idx";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "resumeUrl" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "priority" "JobPriority" NOT NULL DEFAULT 'ROUTINE',
ADD COLUMN     "salaryCurrency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "resumeUrl" TEXT,
ADD COLUMN     "skills" TEXT[];

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "registrationNo" TEXT,
    "website" TEXT,
    "emailDomain" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "docVerified" BOOLEAN NOT NULL DEFAULT false,
    "docUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_ownerId_key" ON "Company"("ownerId");

-- CreateIndex
CREATE INDEX "Job_country_idx" ON "Job"("country");

-- CreateIndex
CREATE INDEX "Job_city_idx" ON "Job"("city");

-- CreateIndex
CREATE INDEX "Job_priority_idx" ON "Job"("priority");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
