import React from 'react'
import AuthLayout from '../AuthLayout'
import ForgotPasswordForm from './components/ForgetPasswordForm'
const ForgetPasswordPage = () => {
  return (
    <div>
      <AuthLayout children={<ForgotPasswordForm/>}/>
    </div>
  )
}

export default ForgetPasswordPage
