import React from 'react'
import AuthLayout from '../AuthLayout'
import LoginForm from './components/LoginForm'

const LoginPage = () => {
  return (
    <div>
      <AuthLayout children={<LoginForm/>}/>
    </div>
  )
}

export default LoginPage
