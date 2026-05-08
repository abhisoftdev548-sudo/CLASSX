import React from 'react'
import AuthLayout from '../AuthLayout'
import VerifyEmailForm from './components/VerifyEmailForm'

const VerifyEmailPage = () => {
  return (
    <div>
      <AuthLayout children={<VerifyEmailForm/>} />
    </div>
  )
}

export default VerifyEmailPage
