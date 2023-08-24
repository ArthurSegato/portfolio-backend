-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Game', 'Webdev', 'App', 'Bot', 'Localization');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cardDescr" TEXT NOT NULL,
    "cardImg" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'Game',
    "visits" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "starts" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "techStack" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
