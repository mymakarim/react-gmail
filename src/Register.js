import { useState } from 'react'
import { auth } from './firebase'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { useAuthValue } from './AuthContext'

function Register() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setTimeActive } = useAuthValue()

  const validatePassword = () => {
    let isValid = true
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
    }
    return isValid
  }

  const register = (e) => {
    setLoading(true)
    e.preventDefault()
    setError('')
    if (validatePassword()) {
      // Create a new user with email and password using firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              setTimeActive(true)
              navigate('/verify-email')
            })
            .catch((err) => alert(err.message))
        })
        .catch((err) => setError(err.message))
    }
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setLoading(false)
  }

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <br />
            <div className='ticket-visual_ticket-number font-right'>Register</div>
            <br />
            <br />
          </div>
          {error && <div className='auth__error'>{error}</div>}
          {localStorage.getItem('mağket') !== 'ymakarim@gmail.com' && (
            <form onSubmit={register} name='registration_form' className='login_form'>
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
              <div className='group'>
                <input
                  type='password'
                  value={confirmPassword}
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label htmlFor='name'>Confirm Password</label>
                <div className='bar'></div>
              </div>
              <br />
              <button disabled={loading} className='btn' type='submit'>
                {!loading ? 'Register' : 'Register...'}
              </button>
            </form>
          )}
          <span>
            {localStorage.getItem('mağket') !== 'ymakarim@gmail.com'
              ? 'Already have an account?'
              : 'You can only register once!'}
            <br />
            <Link className='link' to='/login'>
              <small>Login here</small>
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register
