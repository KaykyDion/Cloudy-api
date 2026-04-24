import { PostComment } from "@prisma/client";
import {
  CommentsRepository,
  CreateCommentInterface,
} from "../CommentsRepository";
import { randomUUID } from "node:crypto";

export class InMemoryCommentsRepository implements CommentsRepository {
  public comments: PostComment[] = [];
  public likes: Map<string, Set<string>> = new Map();

  async createComment({
    postId,
    ownerId,
    content,
  }: CreateCommentInterface): Promise<PostComment> {
    const comment: PostComment = {
      id: randomUUID(),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId,
      postId,
    };

    this.comments.push(comment);

    return comment;
  }

  async findCommentById(commentId: string): Promise<PostComment | null> {
    return this.comments.find((comment) => comment.id === commentId) ?? null;
  }

  async updateComment(
    commentId: string,
    newContent: string,
  ): Promise<PostComment> {
    this.comments = this.comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, content: newContent, updatedAt: new Date() }
        : comment,
    );
    return this.comments.find((comment) => comment.id === commentId)!;
  }

  async likeComment(userId: string, commentId: string): Promise<void> {
    if (!this.likes.has(commentId)) {
      this.likes.set(commentId, new Set());
    }
    this.likes.get(commentId)!.add(userId);
  }

  async removeLikeFromComment(
    userId: string,
    commentId: string,
  ): Promise<void> {
    this.likes.get(commentId)?.delete(userId);
  }

  async deleteComment(commentId: string): Promise<PostComment> {
    const commentToDelete = this.comments.find(
      (comment) => comment.id === commentId,
    )!;
    this.comments = this.comments.filter((comment) => comment.id !== commentId);
    this.likes.delete(commentId);
    return commentToDelete;
  }
}
