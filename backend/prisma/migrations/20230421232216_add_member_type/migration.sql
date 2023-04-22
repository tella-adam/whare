-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('PARENT', 'CHILD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "memberType" "MemberType" NOT NULL DEFAULT 'PARENT';
