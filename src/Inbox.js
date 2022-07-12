import { db } from './firebase'
import { useEffect, useState, useCallback } from 'react'
import { query, orderBy, collection, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'

function Inbox() {
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [unread, setUnread] = useState([])

  const docs = []
  const getInbox = async () => {
    setLoading(true)
    console.log('GET QUEUE CALLED!!!!')
    console.log(`messages`)
    const querySnapshot = await getDocs(
      query(collection(db, `messages`), orderBy('created', 'desc'))
    )
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data())
      docs.push({ id: doc.id, data: doc.data() })
    })
  }

  const getInboxthen = useCallback(() => {
    getInbox().then(() => {
      setTotal(docs.length)
      console.log('TOTAL: ', total)
      console.log('Docs: ', docs)

      setUnread(docs)
      setLoading(false)
      // const index = docs.findIndex((item) => item.id == currentUser?.email)
      // console.log('QUEUE NUM: ', queuenum)
      // console.log('INDEX: ', index)
    })
  })

  useEffect(() => {
    getInboxthen()
  }, [])

  return (
    <div className='center'>
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper py-30'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <div className='ticket-visual_ticket-number font-right'>Inbox</div>
            <br />
          </div>
          <div className='ticket-visual_profile'>
            <div className='ticket-profile_profile'>
              <br />
              <div className='ticket-profile_text font-mplus'>
                {loading ? (
                  'loading...'
                ) : total === 0 ? (
                  'No messages'
                ) : (
                  <ul className='msgs'>
                    {unread.map((msg) => {
                      return (
                        <li key={msg.id} className={msg.data.isRead ? 'read' : ''}>
                          <Link to={`/message/${msg.id}`}>{msg.data.subject}</Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inbox
