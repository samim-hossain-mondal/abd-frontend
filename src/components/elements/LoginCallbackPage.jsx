import React from 'react'
import {useOktaAuth, LoginCallback} from '@okta/okta-react'
import {useNavigate} from 'react-router-dom'

export default function LoginCallbackPage() {
  const {authState} = useOktaAuth()
  const navigate = useNavigate()
  if (authState?.isAuthenticated) navigate('/home')
  return <LoginCallback />
}
