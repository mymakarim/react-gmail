import { db } from './firebase'
import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'

function Message() {
  const { id } = useParams()
  console.log('ID: ', id)

  const [error, setError] = useState(false)
  const [msg, setMsg] = useState(null)

  const getQueue = async () => {
    const docRef = doc(db, 'messages', id)
    try {
      const doc = await getDoc(docRef)
      console.log('document data:', doc.data())
      setMsg(doc.data())
    } catch (e) {
      console.log('Error getting document:', e)
      setError(e)
    }
  }

  const read = async () => {
    const msgRef = doc(db, 'messages', id)

    const result = await updateDoc(msgRef, {
      isRead: true
    })
    console.log('READ DONE: ', result)
  }

  useEffect(() => {
    getQueue()
  }, [])

  useEffect(() => {
    read()
  })

  const Msg = ({ msg }) => {
    console.log('MSG IN MSG: ', msg)
    return (
      <div className='msgs'>
        <p>{msg.subject}</p>
        <small>{msg.content}</small>
      </div>
    )
  }

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper py-30'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <div className='ticket-visual_ticket-number font-right'>Message</div>
            <br />
          </div>
          <div className='ticket-visual_profile'>
            <div className='ticket-profile_profile'>
              <br />
              <div className='ticket-profile_text font-mplus'>
                {error ? `Error: ${error}` : msg === null ? 'loading...' : <Msg msg={msg} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message
