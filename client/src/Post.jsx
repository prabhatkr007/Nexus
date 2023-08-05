import {formatISO9075} from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({ _id,title, summary, cover, content,createdAt,author }) {
    return (
      <div className='post'>
        <div className="image">
            <Link to = {`article/${_id}`}>
          <img src={'api/'+cover} alt="thumbnail" />
          </Link>
        </div>
        <div className='text'>
        <Link to = {`/article/${_id}`}>
          <h2>{title}</h2>
        </Link>
          <p className="info">
            <a href="./" className="author">{author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    );
  }
  