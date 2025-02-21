/*
  Warnings:

  - You are about to drop the `_UserProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserProjects" DROP CONSTRAINT "_UserProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserProjects" DROP CONSTRAINT "_UserProjects_B_fkey";

-- DropTable
DROP TABLE "_UserProjects";
