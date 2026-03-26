// services/api.js
// Exp 05 — Fetch API using async/await
// Fetches posts from a public REST API (JSONPlaceholder)

const BASE_URL = "https://jsonplaceholder.typicode.com";

// GET — fetch all posts
export const fetchPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts?_limit=10`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchPosts error:", error);
    return [];
  }
};

// GET — fetch a single post by id
export const fetchPostById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchPostById error:", error);
    return null;
  }
};

// POST — create a new post
export const createPost = async (title, body) => {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, userId: 1 }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createPost error:", error);
    return null;
  }
};
