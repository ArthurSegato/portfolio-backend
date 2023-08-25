-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Card', 'Banner', 'Screenshot');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Screenshot';
