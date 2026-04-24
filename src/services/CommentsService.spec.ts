import { beforeEach, describe, expect, it } from "vitest";
import { CommentsService } from "./CommentsService";
import { AuthenticatedUser } from "./PostsService";
import { randomUUID } from "node:crypto";
import { InMemoryCommentsRepository } from "../repositories/in-memory/InMemoryCommentsRepository";
import { InMemoryPostsRepository } from "../repositories/in-memory/InMemoryPostsRepository";
import { HttpError } from "../errors/HttpError";

describe("Comments Service", () => {
  let commentsRepository: InMemoryCommentsRepository;
  let postsRepository: InMemoryPostsRepository;
  let commentsService: CommentsService;
  let authenticatedUser: AuthenticatedUser = {
    id: randomUUID(),
    name: "John Doe",
    email: "johndoe@example.com",
    password: "123456",
  };

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository();
    postsRepository = new InMemoryPostsRepository();
    commentsService = new CommentsService(commentsRepository, postsRepository);
  });

  it("should create a comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    expect(createdComment.content).toBe("Hello");
  });

  it("should throw an error when the post to  comment is not found", async () => {
    await expect(
      commentsService.createComment({
        postId: randomUUID(),
        content: "Hello",
        ownerId: authenticatedUser.id,
      }),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should update a comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    const updatedComment = await commentsService.updateComment(
      createdComment.id,
      "Hi",
      authenticatedUser.id,
    );

    expect(createdComment.content).not.toBe(updatedComment.content);
  });

  it("should throw an error when the comment to update is not found", async () => {
    await expect(
      commentsService.updateComment(randomUUID(), "Hi", authenticatedUser.id),
    ).rejects.toThrow(new HttpError(404, "Comment not found!"));
  });

  it("should throw an error when an user tries to update another user's comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    await expect(
      commentsService.updateComment(createdComment.id, "Hi", randomUUID()),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });

  it("should add like a comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    const message = await commentsService.likeComment(
      createdComment.id,
      authenticatedUser,
    );

    expect(message).contain("successfully liked");
  });

  it("should throw an error when the comment to like is not found", async () => {
    await expect(
      commentsService.likeComment(randomUUID(), authenticatedUser),
    ).rejects.toThrow(new HttpError(404, "Comment not found!"));
  });

  it("should remove like from comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    await commentsService.likeComment(createdComment.id, authenticatedUser);

    const message = await commentsService.removeLikeFromComment(
      createdComment.id,
      authenticatedUser,
    );

    expect(message).contain("successfully removed");
  });

  it("should thorw an error when the comment to remove like is not found", async () => {
    await expect(
      commentsService.removeLikeFromComment(randomUUID(), authenticatedUser),
    ).rejects.toThrow(new HttpError(404, "Comment not found!"));
  });

  it("should delete a comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    const deletedComment = await commentsService.deleteComment(
      createdComment.id,
      authenticatedUser.id,
    );

    expect(deletedComment.content).toBe(createdComment.content);
  });

  it("should throw an error when the comment to delete is not found", async () => {
    await expect(
      commentsService.deleteComment(randomUUID(), authenticatedUser.id),
    ).rejects.toThrow(new HttpError(404, "Comment not found!"));
  });

  it("should throw an error when an user tries to delete another user's comment", async () => {
    const post = await postsRepository.createPost(
      authenticatedUser.id,
      "Hello World!",
    );

    const createdComment = await commentsService.createComment({
      postId: post.id,
      content: "Hello",
      ownerId: authenticatedUser.id,
    });

    await expect(
      commentsService.deleteComment(createdComment.id, randomUUID()),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });
});
