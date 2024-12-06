/*
  Warnings:

  - The primary key for the `PostComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `PostComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id");
