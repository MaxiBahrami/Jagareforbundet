import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Menu = ({cat}) => {
  const [posts,setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/?cat=${cat}`);
        setPosts(res.data)
      }catch(err){
        console.log(err)

      }
    };
    fetchData();
  }, [cat]);

  const handleClick = (postId) => {
    // Navigate to the single post page with the clicked post ID
    navigate(`/post/${postId}`);
  };

  return (
    <Container className='menu'>
      <h1>Andra nyheter som du kan gilla</h1>
      {posts.map((post)=>(
        <div className="post" key={post.id}>
          <div className="img">
            <img src={post.img} alt="" />
          </div>
          <h3>{post.title}</h3>
          <Button onClick={() => handleClick(post.id)}>Läs mer</Button>
        </div>
      ))}
    </Container>
  );
}

export default Menu;
