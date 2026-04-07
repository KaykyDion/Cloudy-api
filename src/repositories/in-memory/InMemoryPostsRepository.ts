import { Post } from "@prisma/client";
import { PostsRepository } from "../PostsRepository";

export class InMemoryPostsRepository implements PostsRepository {
  public posts: Post[] = [];
  public postsLikes: { postId: string; userId: string }[] = [];

  async createPost(ownerId: string, content: string): Promise<Post> {
    const post: Post = {
      id: crypto.randomUUID(),
      ownerId: ownerId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.push(post);

    return post;
  }

  async searchPostsPaginated(page: number, text: string): Promise<Post[]> {
    const filteredPosts = this.posts
      .filter((post) => post.content.toLowerCase().includes(text.toLowerCase()))
      .slice((page - 1) * 20, page * 20);

    return filteredPosts;
  }

  async getPostById(postId: string): Promise<Post | null> {
    const post = this.posts.find((post) => post.id === postId);

    if (!post) {
      return null;
    }

    return post;
  }

  async editPost(postId: string, newContent: string): Promise<Post | null> {
    const postIndex = this.posts.findIndex((post) => post.id === postId);

    if (postIndex === -1) {
      return null;
    }

    const updatedPosts = this.posts.map((post) => {
      if (post.id === postId) {
        return { ...post, content: newContent, updatedAt: new Date() };
      }

      return post;
    });

    this.posts = updatedPosts;

    return this.posts[postIndex];
  }

  async likePost(userId: string, postId: string): Promise<void> {
    this.postsLikes.push({ userId, postId });
  }

  async removeLikeFromPost(userId: string, postId: string): Promise<void> {
    const updatedPostLikes = this.postsLikes.filter(
      (like) => like.postId !== postId && like.userId !== userId,
    );
    this.postsLikes = updatedPostLikes;
  }

  async deletePost(postId: string): Promise<Post | null> {
    const postToDelete = this.posts.find((post) => post.id === postId);

    if (!postToDelete) {
      return null;
    }

    this.posts = this.posts.filter((post) => post.id !== postId);
    return postToDelete;
  }
}
