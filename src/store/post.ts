import { create } from "zustand";
import { api } from "../api/axios";
import axios from "axios";

export type Comment = {
  id: number;
  postId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string; // ISO date
};

export type Post = {
  id: string;
  userId: number;
  title: string;
  content: string;
  createdAt: string; // ISO date
  updatedAt?: string | null; // ISO date
  tags: string[];
  rate: number;
  timeLecture: number;
  image: string;
  category: "Travel" | "Food" | "Fashion" | "Technology" | "Health";
  comments?: Comment[] | null;
  status: "published" | "draft";
};

type CrudState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

type PostStore = {
  posts: Post[];
  post: Post | null;
  nextId: number;

  fetchState: CrudState;
  postState: CrudState;
  updateState: CrudState;
  deleteState: CrudState;

  getPostById: (id: string) => Post | undefined;
  getPostsByCategory: (category: Post["category"]) => Post[];

  fetchPosts: () => Promise<void>;
  fetchPost: (id: string) => Promise<void>;
  addPost: (post: Omit<Post, "id">) => Promise<void>;
  updatePost: (id: string, data: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;

  addComment: (
  postId: string,
  comment: Omit<Comment, "id" | "createdAt" | "postId">
) => Promise<void>;

  updateComment: (postId: string, commentId: number, data: Partial<Comment>) => Promise<void>;
  deleteComment: (postId: string, commentId: number) => Promise<void>;
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};

const setCrudState = <K extends "fetchState" | "postState" | "updateState" | "deleteState">(
  set: (state: Partial<PostStore> | ((prev: PostStore) => Partial<PostStore>)) => void,
  key: K,
  state: Partial<CrudState>
) => {
  set((prev) => ({
    [key]: { ...prev[key], ...state },
  }));
};


export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  post: null,
  nextId: 10,

  fetchState: { loading: false, error: null, success: null },
  postState: { loading: false, error: null, success: null },
  updateState: { loading: false, error: null, success: null },
  deleteState: { loading: false, error: null, success: null },

  getPostById: (id) => get().posts.find((p) => p.id === id),
  getPostsByCategory: (category) => get().posts.filter((p) => p.category === category),

  fetchPosts: async () => {
    setCrudState(set, "fetchState", { loading: true, error: null, success: null });
    try {
      const res = await api.get<Post[]>("/posts");
      const posts = res.data;
      set({
        posts,
        fetchState: { loading: false, error: null, success: "Posts fetched successfully" },
      });
    } catch (error) {
      setCrudState(set, "fetchState", { loading: false, error: getErrorMessage(error) });
    }
  },

  fetchPost: async (id) => {
    setCrudState(set, "postState", { loading: true, error: null, success: null });
    try {
      const res = await api.get<Post>(`/posts/${id}`);
      set({
        post: res.data,
        postState: { loading: false, error: null, success: "Post fetched successfully" },
      });
    } catch (error) {
      setCrudState(set, "postState", { loading: false, error: getErrorMessage(error) });
    }
  },

  addPost: async (post) => {
  setCrudState(set, "postState", { loading: true, error: null, success: null });
  try {
    // NON impostare id manualmente
    const res = await api.post<Post>("/posts", post); 
    const newPost = res.data; // JSON Server ti restituisce il post completo con id

    set((state) => ({
      posts: [...state.posts, newPost],
      postState: { loading: false, error: null, success: "Post added successfully" },
    }));
  } catch (error) {
    setCrudState(set, "postState", { loading: false, error: getErrorMessage(error) });
  }
},


  updatePost: async (id, data) => {
    setCrudState(set, "updateState", { loading: true, error: null, success: null });
    try {
      const existingPost = get().posts.find((p) => p.id === id) || get().post;
if (!existingPost) throw new Error("Post not found");

      const updatedPost: Post = { ...existingPost, ...data, updatedAt: new Date().toISOString() };
      await api.put(`/posts/${id}`, updatedPost);

      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        post: state.post?.id === id ? updatedPost : state.post,
        updateState: { loading: false, error: null, success: "Post updated successfully ✅" },
      }));
    } catch (error) {
      setCrudState(set, "updateState", { loading: false, error: getErrorMessage(error) });
    }
  },

  deletePost: async (id) => {
    setCrudState(set, "deleteState", { loading: true, error: null, success: null });
    try {
      await api.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        deleteState: { loading: false, error: null, success: "Post deleted!" },
      }));
    } catch (error) {
      setCrudState(set, "deleteState", { loading: false, error: getErrorMessage(error) });
    }
  },

addComment: async (postId, commentData) => {
  try {
    const post = get().posts.find((p) => p.id === postId) || get().post;
    if (!post) throw new Error("Post not found");

    const newComment: Comment = {
      id: Date.now(),
      postId: Number(postId), // 👈 lo aggiungi qui
      userId: commentData.userId,
      title: commentData.title,
      content: commentData.content,
      createdAt: new Date().toISOString(),
    };

    const updatedPost: Post = {
      ...post,
      comments: [...(post.comments || []), newComment],
      updatedAt: new Date().toISOString(),
    };

    await api.put(`/posts/${postId}`, updatedPost);

    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? updatedPost : p
      ),
      post: state.post?.id === postId ? updatedPost : state.post,
    }));
  } catch (error) {
    console.error("Add comment error:", error);
  }
},


  updateComment: async (postId, commentId, data) => {
    try {
      const post = get().posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      const updatedComments = post.comments?.map((c) => (c.id === commentId ? { ...c, ...data } : c));
      const updatedPost = { ...post, comments: updatedComments };
      await api.put(`/posts/${postId}`, updatedPost);

      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        post: state.post?.id === postId ? updatedPost : state.post,
      }));
    } catch (error) {
      console.error("Update comment error:", error);
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      const post = get().posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      const updatedComments = post.comments?.filter((c) => c.id !== commentId);
      const updatedPost = { ...post, comments: updatedComments };
      await api.put(`/posts/${postId}`, updatedPost);

      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        post: state.post?.id === postId ? updatedPost : state.post,
      }));
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  },
}));
