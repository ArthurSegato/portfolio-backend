/*
  Warnings:

  - You are about to drop the column `cardDescr` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `cardImg` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `coverImg` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `starts` on the `Project` table. All the data in the column will be lost.
  - Added the required column `shortDescr` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileFormat" AS ENUM ('Image', 'Video');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "cardDescr",
DROP COLUMN "cardImg",
DROP COLUMN "coverImg",
DROP COLUMN "starts",
ADD COLUMN     "shortDescr" TEXT NOT NULL,
ADD COLUMN     "stars" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "type" "FileFormat" NOT NULL DEFAULT 'Image',
    "path" TEXT NOT NULL,
    "alt" TEXT,
    "hash" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
