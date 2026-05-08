import React from 'react'
import SignupPage from './component/SignUpForm'
import AuthLayout from '../AuthLayout'
import SignupForm from './component/SignUpForm'

const SignUpPage = () => {
  return (
    <div>
      <AuthLayout children={<SignupForm/>}/>
    </div>
  )
}

export default SignUpPage;
