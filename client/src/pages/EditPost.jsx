import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('api/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();
      setLoading(true);
  
    try {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('id', id);
      if (files?.[0]) {
        data.set('file', files?.[0]);
      }
      const response = await fetch('api/post', {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });
  
      if (response.ok) {
       
        navigate('/article/' + id);
      } else if(response.status === 401){
        alert('Login first !')
        navigate('/login');
      }
      else if (response.status === 400) {
        navigate('/article/' + id);
        throw new Error('You are not the author');
        
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
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
        
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}