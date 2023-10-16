-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GAMEDEV', 'WEBDEV', 'MOBILE', 'BOT', 'LOCALIZATION', 'UIUX', 'DESIGN');

-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('B', 'KB', 'MB', 'GB');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "visits" INTEGER,
    "downloads" INTEGER,
    "revenue" DOUBLE PRECISION,
    "techStack" TEXT[],
    "size" DOUBLE PRECISION,
    "sizeUnit" "Unit",
    "card" TEXT,
    "embeds" TEXT[],

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

-- CreateTable
CREATE TABLE "Cover" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "poster" TEXT NOT NULL,

    CONSTRAINT "Cover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaImages" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "facebookAlt" TEXT NOT NULL,
    "twitterUrl" TEXT NOT NULL,
    "twitterAlt" TEXT NOT NULL,
    "googleUrl" TEXT NOT NULL,

    CONSTRAINT "MetaImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "poster" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cover_projectId_key" ON "Cover"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaImages_projectId_key" ON "MetaImages"("projectId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cover" ADD CONSTRAINT "Cover_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaImages" ADD CONSTRAINT "MetaImages_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
