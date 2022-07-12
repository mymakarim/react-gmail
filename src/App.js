import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register'
import Message from './Message'
import Profile from './Profile'
import Logout from './Logout'
import Inbox from './Inbox'
import VerifyEmail from './VerifyEmail'
import Login from './Login'
import { useState, useEffect } from 'react'
import { AuthProvider } from './AuthContext'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    <Router>
      <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
        <Routes>
          <Route exact path='/' element={!currentUser?.emailVerified ? <Login /> : <Profile />} />
          <Route
            path='/login'
            element={!currentUser?.emailVerified ? <Login /> : <Navigate to='/' replace />}
          />
          <Route
            path='/register'
            element={!currentUser?.emailVerified ? <Register /> : <Navigate to='/' replace />}
          />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/inbox' element={<Inbox />} />
          <Route exact path='/message/:id' element={<Message />} />
          <Route exact path='/logout' element={<Logout />} />
        </Routes>
        {
          <center className='text-center font-mplus'>
            <small>
              <a
                rel='noreferrer'
                className='link'
                href='https://linktr.ee/mymakarim'
                target='_blank'
              >
                Ask for help | Contact Dev
              </a>
            </small>
          </center>
        }
      </AuthProvider>
    </Router>
  )
}

export default App
