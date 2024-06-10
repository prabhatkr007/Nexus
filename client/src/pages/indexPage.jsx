import React, { useState, useEffect } from "react";
import Post from "../Post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/post');
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error("No posts to show");
      }

      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);  // Empty dependency array to fetch posts only once after the initial render


  if (error) {
    return <div> {error}</div>;
  }

  return (
        posts.map(post => (
          <Post key={post._id} {...post} />
        )
  )
);
};
