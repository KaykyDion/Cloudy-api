import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryPostsRepository } from "../repositories/in-memory/InMemoryPostsRepository";
import { AuthenticatedUser, PostsService } from "./PostsService";
import { randomUUID } from "node:crypto";
import { HttpError } from "../errors/HttpError";

describe("Posts Services", () => {
  let postsRepository: InMemoryPostsRepository;
  let postsService: PostsService;
  let authenticatedUser: AuthenticatedUser = {
    id: randomUUID(),
    name: "John Doe",
    email: "johndoe@example.com",
    password: "123456",
  };

  beforeEach(() => {
    postsRepository = new InMemoryPostsRepository();
    postsService = new PostsService(postsRepository);
  });

  it("should create a post", async () => {
    const post = await postsService.createPost(
      authenticatedUser,
      "Hello World!",
    );

    expect(post.content).toEqual("Hello World!");
  });

  it("should search posts", async () => {
    await postsService.createPost(authenticatedUser, "Hello!");

    await postsService.createPost(authenticatedUser, "World!");

    const { posts, meta } = await postsService.searchPosts(1, "World");

    expect(posts.length).toBe(1);
    expect(meta.page).toBe(1);
  });

  it("should find a post by id", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const post = await postsService.findPostById(createdPost.id);

    expect(post).toEqual(createdPost);
  });

  it("should throw an error when no post is found by id", async () => {
    await expect(
      postsService.findPostById("5958fd71-3989-4b8a-bc98-96f8eef1508c"),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should edit a post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const editedPost = await postsService.editPost(
      createdPost.id,
      "Hello World!",
      authenticatedUser,
    );

    expect(editedPost).not.toEqual(createdPost);
    expect(editedPost?.content).toEqual("Hello World!");
  });

  it("should throw an error when no post is found to edit", async () => {
    await expect(
      postsService.editPost(
        "5958fd71-3989-4b8a-bc98-96f8eef1508c",
        "Hello World!",
        authenticatedUser,
      ),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should throw an error when an user tries to edit another user's post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const anotherUser: AuthenticatedUser = {
      id: "6ad74f80-2313-4d9d-b3b5-53e844e1d19c",
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      password: "janedoe123456",
    };

    await expect(
      postsService.editPost(createdPost.id, "Hello World!", anotherUser),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });

  it("should like a post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const message = await postsService.likePost(
      authenticatedUser.id,
      createdPost.id,
    );

    expect(message).toBe("Post successfully liked!");
  });

  it("should throw an error when no post is found to like", async () => {
    await expect(
      postsService.likePost(
        authenticatedUser.id,
        "5958fd71-3989-4b8a-bc98-96f8eef1508c",
      ),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should remove a like from post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    await postsService.likePost(authenticatedUser.id, createdPost.id);

    const message = await postsService.removeLikeFromPost(
      authenticatedUser.id,
      createdPost.id,
    );

    expect(message).toBe("Like successfully removed from post");
  });

  it("should throw an error when no post is found to remove a like", async () => {
    await expect(
      postsService.removeLikeFromPost(
        authenticatedUser.id,
        "5958fd71-3989-4b8a-bc98-96f8eef1508c",
      ),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should delete a post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const message = await postsService.deletePost(
      createdPost.id,
      authenticatedUser,
    );

    expect(message).toBe("Post successfully deleted!");
  });

  it("should throw an error when no post is found to delete", async () => {
    await expect(
      postsService.deletePost(
        "5958fd71-3989-4b8a-bc98-96f8eef1508c",
        authenticatedUser,
      ),
    ).rejects.toThrow(new HttpError(404, "Post not found!"));
  });

  it("should throw an error when an user tries to delete another user's post", async () => {
    const createdPost = await postsService.createPost(
      authenticatedUser,
      "Hello!",
    );

    const anotherUser: AuthenticatedUser = {
      id: "6ad74f80-2313-4d9d-b3b5-53e844e1d19c",
      name: "Jane Doe",
      email: "janedoe@gmail.com",
      password: "janedoe123456",
    };

    await expect(
      postsService.deletePost(createdPost.id, anotherUser),
    ).rejects.toThrow(
      new HttpError(401, "You do not have permission to perform this action!"),
    );
  });
});
