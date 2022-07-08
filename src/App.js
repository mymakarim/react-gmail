import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Profile from './Profile'
import Register from './Register'
import Counter from './counter'
import Complete from './complete'
import Yahya from './yahya'
import Logout from './Logout'
import List from './List'
import VerifyEmail from './VerifyEmail'
import Login from './Login'
import { useState, useEffect } from 'react'
import { AuthProvider } from './AuthContext'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import PrivateRoute from './PrivateRoute'
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
          <Route
            exact
            path='/'
            element={
              !currentUser?.emailVerified ? (
                <Login />
              ) : (
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              )
            }
          />
          <Route
            path='/login'
            element={!currentUser?.emailVerified ? <Login /> : <Navigate to='/' replace />}
          />
          <Route
            path='/register'
            element={!currentUser?.emailVerified ? <Register /> : <Navigate to='/' replace />}
          />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route
            exact
            path='/list'
            element={
              <PrivateRoute>
                <List />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path='/yahya'
            element={
              <PrivateRoute>
                <Yahya />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path='/complete'
            element={
              <PrivateRoute>
                <Complete />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path='/counter'
            element={
              <PrivateRoute>
                <Counter />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path='/logout'
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />
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
