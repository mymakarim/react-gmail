import { Navigate } from 'react-router-dom'
import { useAuthValue } from './AuthContext'

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuthValue()
  let verify = currentUser?.emailVerified

  if (verify === undefined) {
    setTimeout(() => {
      console.log('Gotta wait')
    }, 3000)
  }
  console.log('CURRETN USER VERIFY: ', !currentUser?.emailVerified)
  if (verify === false) {
    return <Navigate to='/login' replace />
  }

  return children
}
