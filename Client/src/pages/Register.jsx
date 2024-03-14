import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button} from 'react-bootstrap';

const Register = () => {
  const [inputs,setInputs] = useState({
    username:"",
    email:"",
    password:"",
  })

  const [err,setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = e =>{
    setInputs(prev=>({...prev, [e.target.name]: e.target.value}))
  };

  const handleSubmit = async e =>{
    e.preventDefault();
    try{
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, inputs);
      navigate("/Login");
    }catch(err){
      setError(err.response.data);
    }
  };

  return (
    <Container className='auth'>
      <div className="authDiv">
      <h1>Registrera</h1>
      <form >
        <input required type="text" placeholder='Användarnamn' name='username' onChange={handleChange}/>
        <input required type="email" placeholder='e-post' name='email' onChange={handleChange}/>
        <input required type="password " placeholder='Lösenord' name='password' onChange={handleChange}/>
        <Button onClick={handleSubmit}>Registrera</Button>
        {err && <p>{err}</p>}
        <span>Har du ett konto?.. <Link to="/Login">Logga in</Link></span>
      </form>
      </div>
    </Container>
  );
}

export default Register;

