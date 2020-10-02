import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { initializeLoginFramework, handleGoogleSingIn, handleSignOut, handleFbSignIn, createUserWithEmailAndPassword, signInWithEmailAndPassword, resetPassword } from './loginManager';



function Login() {

  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    newUser:false,
    name:'',
    email: '',
    password:'',
    photo: '',
   
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSingIn = () => {
      handleGoogleSingIn()
      .then(res => {
        handleResponse(res, true)
        })
  }

  const fbSignIn = () => {
      handleFbSignIn()
      .then(res => {
        handleResponse(res, true)
      })
  }

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false)
      })
  }

  const handleResponse = (res, redirect) => {
    setUser(res)
    setLoggedInUser(res)
    if(redirect){
        history.replace(from);
    }
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length >= 6;
      //12345678@aA....12345678@aA
      const isPasswordHasNumber = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/.test(e.target.value)
      isFieldValid = isPasswordValid && isPasswordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword( user.name, user.email, user.password)
      .then(res =>{
        handleResponse(res, true)
      })
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        handleResponse(res, true)
      })
    }
    e.preventDefault();
  }


  return (
    <div style={{textAlign:'center'}}>
     {
       user.isSignedIn ?  <button onClick={signOut}>Sign out</button> :
         <button onClick={googleSingIn}>Sign in</button>
     }
     <br/>
     <button onClick={fbSignIn}>Sign in using facebook</button>
      {
        user.isSignedIn && <div>
        <p>Welcome, {user.name}</p>
        <p>Your email:{user.email}</p>
        <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>}
        <br/> <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter your email address" required/>
        <br/> <br/>
        <input type="password" onBlur={handleBlur} name="password" placeholder="Enter your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <button onClick={() => resetPassword(user.email)}>Forget or Reset Password</button>
       <p style={{color:'red'}}>{user.error}</p>
       {user.success &&   <p style={{color:'green'}}>user { newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default Login;
