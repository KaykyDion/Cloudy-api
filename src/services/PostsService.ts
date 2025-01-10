import { PostsRepository } from "../repositories/PostsRepository";
import { HttpError } from "../errors/HttpError";

export interface AuthenticatedUser {
  id: string;
  email: string;
  password: string;
  name: string;
}

export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(authenticatedUser: AuthenticatedUser, content: string) {
    const post = await this.postsRepository.createPost(
      authenticatedUser.id,
      content
    );
    return post;
  }

  async searchPosts(page: number, text: string) {
    const posts = await this.postsRepository.searchPostsPaginated(page, text);
    return { posts, meta: { page } };
  }

  async findPostById(postId: string) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    return post;
  }

  async editPost(
    postId: string,
    content: string,
    authenticatedUser: AuthenticatedUser
  ) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    if (post.ownerId !== authenticatedUser.id)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    const updatedPost = await this.postsRepository.editPost(postId, content);
    if (!updatedPost) throw new HttpError(404, "Post not found!");
    return updatedPost;
  }

  async likePost(userId: string, postId: string) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    await this.postsRepository.likePost(userId, postId);
    return "Post successfully liked!";
  }

  async removeLikeFromPost(userId: string, postId: string) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    await this.postsRepository.removeLikeFromPost(userId, postId);
    return "Like successfully removed from post";
  }

  async deletePost(postId: string, authenticatedUser: AuthenticatedUser) {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) throw new HttpError(404, "Post not found!");
    if (post.ownerId !== authenticatedUser.id)
      throw new HttpError(
        401,
        "You do not have permission to perform this action!"
      );
    await this.postsRepository.deletePost(postId);
    return "Post successfully deleted!";
  }
}
