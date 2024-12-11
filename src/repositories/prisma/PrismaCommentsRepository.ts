import { PostComment } from "@prisma/client";
import {
  CommentsRepository,
  CreateCommentInterface,
} from "../CommentsRepository";
import { prisma } from "../../database";

export class PrismaCommentsRepository implements CommentsRepository {
  async createComment({
    postId,
    ownerId,
    content,
  }: CreateCommentInterface): Promise<PostComment> {
    return await prisma.postComment.create({
      data: { content, ownerId, postId },
    });
  }

  async findCommentById(commentId: string): Promise<PostComment | null> {
    return await prisma.postComment.findUnique({ where: { id: commentId } });
  }

  async updateComment(
    commentId: string,
    newContent: string
  ): Promise<PostComment> {
    return await prisma.postComment.update({
      where: { id: commentId },
      data: { content: newContent },
    });
  }

  async likeComment(userId: string, commentId: string): Promise<void> {
    await prisma.postComment.update({
      where: { id: commentId },
      data: { likes: { connect: { id: userId } } },
    });
  }

  async removeLikeFromComment(
    userId: string,
    commentId: string
  ): Promise<void> {
    await prisma.postComment.update({
      where: { id: commentId },
      data: { likes: { disconnect: { id: userId } } },
    });
  }

  async deleteComment(commentId: string): Promise<PostComment> {
    return await prisma.postComment.delete({ where: { id: commentId } });
  }
}
