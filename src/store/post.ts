import { create } from "zustand";
import { api } from "../api/axios";
import axios from "axios";

type Comment = {
  id: number;
  postId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string; // ISO date
};

export type Post = {
  id: number;
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
};

type PostState = {
  posts: Post[];
  post: Post | null;
  nextId: number; // for mock ID generation


  // ---- CRUD STATE ----
  fetchState: CrudState;
  postState: CrudState;
  updateState: CrudState;
  deleteState: CrudState;

  // ---- GETTERS ----
  getPostById: (id: number) => Post | undefined;
  getPostsByCategory: (category: Post["category"]) => Post[];

  // ---- CRUD OPERATIONS ----
  fetchPosts: () => Promise<void>;
  fetchPost: (id: number) => Promise<void>;
  addPost: (post: Omit<Post, "id">) => void;
  updatePost: (id: number, data: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;

  // ---- COMMENTS handled through posts ----
  addComment: (postId: number, comment: Comment) => Promise<void>;
  updateComment: (
    postId: number,
    commentId: number,
    data: Partial<Comment>,
  ) => Promise<void>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  post: null,
  nextId: 10, // starting point for mock IDs

  // ---- CRUD STATE ----
  fetchState: { loading: false, error: null },
  postState: { loading: false, error: null },
  updateState: { loading: false, error: null },
  deleteState: { loading: false, error: null },

  // ---- GETTERS ----
  getPostById: (id) => get().posts.find((p) => p.id === id),
  getPostsByCategory: (category) =>
    get().posts.filter((p) => p.category === category),

  // ---- FETCH ----
 fetchPosts: async () => {
  set({ fetchState: { loading: true, error: null } });
  try {
    const res = await api.get("/posts");
    const posts: Post[] = res.data;

    const maxId = posts.length
      ? Math.max(...posts.map((p) => p.id))
      : 9;

    set({
      posts,
      nextId: maxId + 1, // 👈 mantiene la sequenza
      fetchState: { loading: false, error: null },
    });
  } catch (error: unknown) {
    set({
      fetchState: {
        loading: false,
        error: getErrorMessage(error),
      },
    });
  }
},


  fetchPost: async (id) => {
    set({ postState: { loading: true, error: null } });
    try {
      const res = await api.get(`/posts/${id}`);
      set({ post: res.data, postState: { loading: false, error: null } });
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
        },
      });
    }
  },

  // ---- ADD POST ----
 addPost: async (post) => {
  set({ postState: { loading: true, error: null } });

  try {
    const id = get().nextId;

    const newPost: Post = {
      ...post,
      id,
    };

    // 🔹 se usi API reale
    await api.post("/posts", newPost);

    // 🔹 aggiorna store locale
    set((state) => ({
      posts: [...state.posts, newPost],
      nextId: state.nextId + 1, // 👈 incrementa
      postState: { loading: false, error: null },
    }));
  } catch (error: unknown) {
    set({
      postState: {
        loading: false,
        error: getErrorMessage(error),
      },
    });
  }
},


  // ---- UPDATE POST ----
  updatePost: async (id, data) => {
    set({ updateState: { loading: true, error: null } });
    try {
      const post = get().posts.find((p) => p.id === id);
      if (!post) throw new Error("Post not found");
      const updated = { ...post, ...data };
      await api.put(`/posts/${id}`, updated);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updated : p)),
        updateState: { loading: false, error: null },
      }));
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
        },
      });
    }
  },

  // ---- DELETE POST ----
  deletePost: async (id) => {
    set({ deleteState: { loading: true, error: null } });
    try {
      await api.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        deleteState: { loading: false, error: null },
      }));
    } catch (error: unknown) {
      set({
        fetchState: {
          loading: false,
          error: getErrorMessage(error),
        },
      });
    }
  },

  // ---- COMMENTS (CRUD) ----
  addComment: async (postId, comment) => {
    try {
      const post = get().posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");
      const updated = { ...post, comments: [...(post.comments || []), comment] };
      await api.put(`/posts/${postId}`, updated);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updated : p)),
      }));
    } catch (error) {
      console.error("Add comment error:", error);
    }
  },

  updateComment: async (postId, commentId, data) => {
    try {
      const post = get().posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");
      const updatedComments = post.comments?.map((c) =>
        c.id === commentId ? { ...c, ...data } : c,
      );
      const updatedPost = { ...post, comments: updatedComments };
      await api.put(`/posts/${postId}`, updatedPost);
      set((state) => ({
        posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
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
      }));
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  },
}));
