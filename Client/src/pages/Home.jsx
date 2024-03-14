import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const cat = useLocation().search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/posts${cat}`;
        const res = await axios.get(apiUrl);
        setPosts(res.data);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again later.');

    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [cat]);

  const truncateText = (text, limit) => {
    // Find the second occurrence of a dot (.)
    const secondDotIndex = text.indexOf('.', text.indexOf('.') + 1);
  
    // Truncate at the second dot or use the entire text if no second dot is found
    const truncatedText = secondDotIndex !== -1 ? text.substring(0, secondDotIndex + 1) : text;
  
    // Add "mer..." to indicate more content
    const moreText = text.length > truncatedText.length ? ' mer...' : '';
  
    return truncatedText + moreText;
  };

  const handleClick = (postId) => {
    // Navigate to the single post page with the clicked post ID
    navigate(`/post/${postId}`);
  };

  return (
    <Container className='home'>
  {error ? (
    <p>Error: {error}</p>
  ) : loading ? (
    <p>Loading...</p>
  ) : (
    <div className="posts">
      {posts.map(post => (
        <div className="post" key={post.id}>
          <div className="img">
            <img src={post.img} alt="" />
          </div>
            <div className="content">
              <Link className='link' to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
                {/* Use the truncateText function for post.desc */}
                <p>{truncateText(post.desc, 150)}</p>
                <Button onClick={() => handleClick(post.id)}>Läs mer</Button>
              </Link>
            </div>
          </div>
        ))}
     </div>
  )}
</Container>
  );
};

export default Home;