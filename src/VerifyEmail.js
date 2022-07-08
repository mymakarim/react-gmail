import { useAuthValue } from './AuthContext'
import { useState, useEffect } from 'react'
import { auth } from './firebase'
import { sendEmailVerification } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

function VerifyEmail() {
  const { currentUser } = useAuthValue()
  const [time, setTime] = useState(60)
  const { timeActive, setTimeActive } = useAuthValue()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser
        ?.reload()
        .then(() => {
          if (currentUser?.emailVerified) {
            clearInterval(interval)
            navigate('/')
          }
        })
        .catch((err) => {
          alert(err.message)
        })
    }, 1000)
  }, [navigate, currentUser])

  useEffect(() => {
    let interval = null
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1)
      }, 1000)
    } else if (time === 0) {
      setTimeActive(false)
      setTime(60)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timeActive, time, setTimeActive])

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setTimeActive(true)
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const email = localStorage.getItem('mağket')

  if (!email) {
    localStorage.setItem('mağket', email)
  }

  return (
    <div className='ticket-visual_visual'>
      <div className='ticket-visual-wrapper'>
        <div className='ticket-visual_ticket-number-wrapper'>
          <br />
          <br />
          <div className='ticket-visual_ticket-number font-right'>Verify</div>
          <br />
          <br />
        </div>
        <div className='login_form'>
          <p>
            <strong>A Verification email has been sent to:</strong>
            <span>{currentUser?.email}</span>
          </p>
          <p>Follow the instruction in the email to verify your account</p>
          <button className='btn' onClick={resendEmailVerification} disabled={timeActive}>
            Resend Email {timeActive && time}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
