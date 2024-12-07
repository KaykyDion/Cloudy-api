import { Post, User } from "@prisma/client";

export interface PostsRepository {
  createPost(ownerId: string, content: string): Promise<Post>;

  searchPostsPaginated(page: number, text: string): Promise<Post[]>;

  getPostById(postId: string): Promise<Post | null>;

  editPost(postId: string, newContent: string): Promise<Post | null>;

  likePost(userId: string, postId: string): Promise<string>;

  removeLikeFromPost(userId: string, postId: string): Promise<string>;

  deletePost(postId: string): Promise<Post | null>;
}