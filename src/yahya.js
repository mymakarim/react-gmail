import { useAuthValue } from './AuthContext'
import { db } from './firebase'
import { useState } from 'react'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

function Yahya() {
  const { currentUser } = useAuthValue()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const registerAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await setDoc(doc(db, 'admins', `${email}`), {
        created: Timestamp.now()
      }).then(async (doc) => {
        setEmail('')
        console.log('Document written with ID: ', doc)
      })
      setLoading(false)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <br />
            <div className='ticket-visual_ticket-number font-right'>Make Admin</div>
            <br />
            <br />
          </div>
          {currentUser?.email === 'ymakarim@gmail.com' && (
            <form onSubmit={registerAdmin} name='registration_form' className='login_form'>
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
              <br />
              <button className='btn' type='submit'>
                Make Admin {loading && '...'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
export default Yahya
