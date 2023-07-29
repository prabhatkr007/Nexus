import { useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

export default function CreatePost(){
    const[title, setTitle] = useState('');
    const[summary, setSummary] = useState('');
    const[content, setContent] = useState('');
    const[files, setFiles] = useState('');
    const navigate = useNavigate();

    async function createNewPost(ev){

        ev.preventDefault();
        const data = new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content', content);
        data.set('file',files[0]);

        try {
          const response = await fetch('https://blog-backend-ne6c.onrender.com/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
          });
        
          if (response.ok) {
            navigate('/');
          } else if(response.status === 401){
            alert('Please Login !')
            navigate('/login');
          }
          else if (response.status === 400) {
            throw new Error('Upload image file!');
          }
          else if (response.status === 500) {
            alert('Fill fields properly');
          }
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
        

    return(
    <form onSubmit={createNewPost}>
        <input type="title" 
        placeholder={"Title"} 
        value={title} 
        onChange={ev => setTitle(ev.target.value)} />

        <input type="summary" 
        placeholder={"Summary"} 
        value={summary}
        onChange={ev => setSummary(ev.target.value)}/>


        <input type="file" 
        onChange={ev => setFiles(ev.target.files)}/>

        <ReactQuill value={content} 
        onChange={newValue => setContent(newValue)}
        modules={modules} 
        formats={formats}/>

        <button style={{marginTop:'5px'}}>Create Post</button>

    </form>
    )
  

}