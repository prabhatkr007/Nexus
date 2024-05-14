import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import '../styles/loader.css'; 

export default function EditPost({ loading, setLoading }) {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`api/post/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post data');
        }
        const postInfo = await response.json();
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    if (loading) return; // Prevent form submission if already loading

    setLoading(true);

    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('id', id);
      if (files?.[0]) {
        data.set('file', files[0]);
      }

      const response = await fetch('api/post', {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        navigate(`/article/${id}`);
      } else if (response.status === 401) {
        alert('Please login first!');
        navigate('/login');
      } else if (response.status === 400) {
        alert('You are not the author of this post');
        navigate(`/article/${id}`);
      } else {
        throw new Error('An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      <Editor
        onChange={setContent}
        value={content}
      />
      <button style={{ marginTop: '5px' }}>Update post</button>
    </form>
  );
}
