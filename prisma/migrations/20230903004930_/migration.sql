-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GAMEDEV', 'WEBDEV', 'MOBILE', 'BOT', 'LOCALIZATION', 'UIUX', 'DESIGN');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CARD', 'BANNER', 'MEDIA');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('B', 'KB', 'MB', 'GB');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "visits" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "stars" INTEGER NOT NULL,
    "techStack" TEXT[],
    "size" DOUBLE PRECISION NOT NULL,
    "sizeUnit" "Unit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "mimetype" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alt" TEXT,
    "role" "Role" NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
