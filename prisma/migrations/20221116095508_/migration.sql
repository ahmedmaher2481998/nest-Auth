/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `hash` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "hash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
