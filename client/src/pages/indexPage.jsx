import React, { useState, useEffect } from "react";
import Post from "../Post";
import "../styles/loader.css"; // Import the CSS for the circle loading animation

export default function IndexPage({loading = loading, setLoading = setLoading}) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('api/post');
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (loading) { // Only fetch if loading is true
      fetchPosts();
    }

  }, [loading]); // Add loading as a dependency

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
        <Post key={post._id} {...post} />
      ))}
    </>
  );
}
