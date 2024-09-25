import React from 'react'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../../firebase'


function Login() {

signInAnonymously(auth)
.then(() => {
    console.log('Logged in anonymously')
})
.catch((error)=> {
    console.error("Error during login", error)
})



  return (
    <></>
  )
}

export default Login