import { HttpError } from "../errors/HttpError";
import {
  CommentsRepository,
  CreateCommentInterface,
} from "../repositories/CommentsRepository";
import { PostsRepository } from "../repositories/PostsRepository";
import { AuthenticatedUser } from "./PostsService";

export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository
  ) {}

  async createComment({ postId, ownerId, content }: CreateCommentInterface) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    const newComment = await this.commentsRepository.createComment({
      postId,
      ownerId,
      content,
    });
    return newComment;
  }

  async updateComment(commentId: string, newContent: string, userId: string) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) throw new HttpError(404, "Comment not found!");
    if (comment.ownerId !== userId)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    const updatedComment = await this.commentsRepository.updateComment(
      commentId,
      newContent
    );
    return updatedComment;
  }

  async likeComment(commentId: string, authenicatedUser: AuthenticatedUser) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) throw new HttpError(404, "Comment not found!");
    const userId = authenicatedUser.id;
    await this.commentsRepository.likeComment(userId, commentId);
    return `Comment successfully liked by ${authenicatedUser.name}`;
  }

  async removeLikeFromComment(
    commentId: string,
    authenicatedUser: AuthenticatedUser
  ) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) throw new HttpError(404, "Comment not found!");
    const userId = authenicatedUser.id;
    await this.commentsRepository.removeLikeFromComment(userId, commentId);
    return `Like successfully removed from comment  by ${authenicatedUser.name}`;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) throw new HttpError(404, "Comment not found!");
    if (comment.ownerId !== userId)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    const deletedComment = await this.commentsRepository.deleteComment(
      commentId
    );
    return deletedComment;
  }
}
