/*
  Warnings:

  - Added the required column `postId` to the `PostComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostComment" ADD COLUMN     "postId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
