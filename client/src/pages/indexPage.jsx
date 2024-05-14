import React, { useState, useEffect } from "react";
import Post from "../Post";

import "../styles/loader.css"; // Import the CSS for the circle loading animation

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('api/post')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(posts => {
        setLoading(false);
        setPosts(posts);
      })
      .catch(error => {
        setLoading(false);
        setError(error.message);
      });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <h3>Free Server Guys, Please Wait !🦜 </h3>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} /> // Use 'post._id' as the key
      ))}
    </>
  );
}
