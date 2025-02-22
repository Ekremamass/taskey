/*
  Warnings:

  - The `role` column on the `TeamsOnUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('LEADER', 'CONTRIBUTOR', 'VIEWER');

-- AlterTable
ALTER TABLE "TeamsOnUsers" DROP COLUMN "role",
ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'CONTRIBUTOR';
