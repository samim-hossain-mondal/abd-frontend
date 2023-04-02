import React from 'react'
import {useOktaAuth, LoginCallback} from '@okta/okta-react'
import {useNavigate} from 'react-router-dom'
import { HOME_ROUTE } from '../constants/routes'

export default function LoginCallbackPage() {
  const {authState} = useOktaAuth()
  const navigate = useNavigate()
  if (authState?.isAuthenticated) navigate(HOME_ROUTE)
  return <LoginCallback />
}
