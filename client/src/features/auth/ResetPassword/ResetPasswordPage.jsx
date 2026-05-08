import React from 'react'
import AuthLayout from '../AuthLayout'
import ResetPasswordForm from './components/ResetPasswordForm'

const ResetPasswordPage = () => {
  return (
    <div>
      <AuthLayout children={<ResetPasswordForm/>} />
    </div>
  )
}

export default ResetPasswordPage
