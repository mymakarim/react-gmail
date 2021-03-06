import { useAuthValue } from './AuthContext'
import { db } from './firebase'
import { useEffect, useState, useCallback } from 'react'
import { query, orderBy, collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const { currentUser } = useAuthValue()
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [unread, setUnread] = useState([])

  const docs = []
  const getQueue = async () => {
    setLoading(true)
    console.log('GET QUEUE CALLED!!!!')
    console.log(`messages`)
    const querySnapshot = await getDocs(query(collection(db, `messages`), orderBy('created')))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data())
      docs.push(doc.data())
    })
  }

  const getQueuethen = useCallback(() => {
    getQueue().then(() => {
      setTotal(docs.length)
      console.log('TOTAL: ', total)
      console.log('Docs: ', docs)
      const unreadArray = docs.filter((e, index) => {
        console.log(index)
        return e.isRead === false
      })

      setUnread(unreadArray)
      setLoading(false)
      // const index = docs.findIndex((item) => item.id == currentUser?.email)
      // console.log('QUEUE NUM: ', queuenum)
      // console.log('INDEX: ', index)
    })
  })

  useEffect(() => {
    getQueuethen()
  }, [])

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper py-30'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <div className='ticket-visual_ticket-number font-right'>Welcome</div>
            <p>{currentUser?.email}</p>
            <br />
          </div>
          <div className='ticket-visual_profile'>
            <div className='ticket-profile_profile'>
              <br />
              <div className='ticket-profile_text font-mplus'>
                {loading
                  ? 'loading...'
                  : `You have ${unread.length} Unread of total ${total} messages`}
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className='ticket-visual_ticket-number-wrapper fields justify-center'>
            <button className='btn' disabled={loading} onClick={() => navigate('/inbox')}>
              Go to inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
