import { PostComment } from "@prisma/client";

export interface CreateCommentInterface {
  postId: string;
  ownerId: string;
  content: string;
}

export interface CommentsRepository {
  createComment({
    postId,
    ownerId,
    content,
  }: CreateCommentInterface): Promise<PostComment>;

  findCommentById(commentId: string): Promise<PostComment | null>;

  updateComment(commentId: string, newContent: string): Promise<PostComment>;

  deleteComment(commentId: string): Promise<PostComment>;
}
