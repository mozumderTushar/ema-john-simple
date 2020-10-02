import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const  initializeLoginFramework = () => {
    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig)
    }
}

export  const handleGoogleSingIn = () =>{
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const singInUser = {
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL,
        success: true
      }
      return singInUser;
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      user.success = true;
      return user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  export const handleSignOut = () => {
    return firebase.auth().signOut()
    .then( res => {
      const signOutUser = {
        isSignedIn:false,
        name:'',
        photo:'',
        email:'',
        error:'',
        success:false
      }
      return signOutUser;
    })
  .catch(err => {

  }) 
  }

  export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then( res => {
      const newUserInfo = res.user;
      newUserInfo.error='';
      newUserInfo.success = true;
      updateProfile(name)
      verifyEmail();
      return newUserInfo;
      // console.log(res);
    })
    .catch(error => {
      // Handle Errors here.
     const newUserInfo = {};
     newUserInfo.error = error.message;
     newUserInfo.success = false;
     return newUserInfo;
    });
  }

  export const signInWithEmailAndPassword = (email,password) => {
    return firebase.auth().signInWithEmailAndPassword(email,password)
    .then( res => {
      const newUserInfo = res.user;
      newUserInfo.error='';
      newUserInfo.success = true;
      return newUserInfo
    //   console.log("sign in user info", res.user);
    })
    .catch(error => {
      // Handle Errors here.
      const newUserInfo = {};
      newUserInfo.error = error.message;
      newUserInfo.success = false;
      return newUserInfo
      // ...
    });
  }

  const updateProfile = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
     console.log("user name updated successfully");
    }).catch(function(error) {
      console.log(error);
    });
  }

  const verifyEmail = () =>{
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }

  export const resetPassword = email => {
    var auth = firebase.auth();
   
    auth.sendPasswordResetEmail(email).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }