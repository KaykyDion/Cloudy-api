import { Post } from "@prisma/client";
import { PostsRepository } from "../PostsRepository";
import { prisma } from "../../database";

export class PrismaPostsRepository implements PostsRepository {
  async createPost(ownerId: string, content: string): Promise<Post> {
    return await prisma.post.create({
      data: {
        ownerId,
        content,
      },
    });
  }

  async searchPostsPaginated(page: number, text: string): Promise<Post[]> {
    return await prisma.post.findMany({
      where: { content: { contains: text } },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        owner: { select: { name: true, email: true } },
        likes: { select: { id: true, name: true } },
        comments: {
          include: {
            owner: { select: { name: true, id: true } },
            likes: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getPostById(postId: string): Promise<Post | null> {
    return await prisma.post.findUnique({
      where: { id: postId },
      include: {
        owner: { select: { name: true } },
        likes: { select: { id: true, name: true } },
        comments: {
          select: {
            id: true,
            createdAt: true,
            content: true,
            owner: { select: { name: true, email: true } },
            _count: { select: { likes: true } },
          },
        },
      },
    });
  }

  async editPost(postId: string, newContent: string): Promise<Post | null> {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: newContent },
    });
    if (!updatedPost) return null;
    return updatedPost;
  }

  async likePost(userId: string, postId: string): Promise<void> {
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { connect: { id: userId } } },
      include: { likes: true },
    });
  }

  async removeLikeFromPost(userId: string, postId: string): Promise<void> {
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { disconnect: { id: userId } } },
      include: { likes: true },
    });
  }

  async deletePost(postId: string): Promise<Post | null> {
    const deletedPost = await prisma.post.delete({ where: { id: postId } });
    if (!deletedPost) return null;
    return deletedPost;
  }
}
