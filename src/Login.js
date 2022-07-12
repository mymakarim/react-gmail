import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'
import { useAuthValue } from './AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setTimeActive } = useAuthValue()
  const navigate = useNavigate()

  const login = (e) => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true)
              navigate('/verify-email')
            })
            .catch((err) => alert(err.message))
        } else {
          navigate('/')
        }
      })
      .catch((err) => setError(err.message))
  }

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <br />
            <div className='ticket-visual_ticket-number font-right'>Log In</div>
            <br />
            <br />
          </div>
          {error && <div className='auth__error'>{error.toString().replace('Firebase: ', '')}</div>}
          <form onSubmit={login} name='login_form' className='login_form'>
            <div className='group'>
              <input
                type='email'
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor='name'>Email</label>
              <div className='bar'></div>
            </div>

            <div className='group'>
              <input
                type='password'
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor='name'>Password</label>
              <div className='bar'></div>
            </div>

            <br />
            <button className='btn' type='submit'>
              Login
            </button>
          </form>
          {localStorage.getItem('mağket') !== 'ymakarim@gmail.com' && false && (
            <p>
              Don't have and account? <br />
              <Link className='link' to='/register'>
                <small>Register here</small>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
