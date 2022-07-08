import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  })

  return <div></div>
}

export default Logout
