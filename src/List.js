import { useAuthValue } from './AuthContext'
import { db } from './firebase'
import { useEffect, useState } from 'react'
import { collection, orderBy, query, doc, deleteDoc, onSnapshot } from 'firebase/firestore'

function List() {
  const { currentUser } = useAuthValue()
  const [deleting, setDeleting] = useState(false)
  const [items, setItems] = useState([])
  const current = new Date()
  const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`

  useEffect(() => {
    let itemshere = []
    /* function to get all tasks from firestore in realtime */
    const q = query(collection(db, date.toString()), orderBy('created'))
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        itemshere.push({ email: doc.id, data: doc.data() })
        // console.log(`DOC.DATA(): ${doc.data()}`)
      })
      // console.log('Current cities in CA: ', itemshere.join(', '))
      // setItems([])
      setItems(itemshere)
    })
  }, [currentUser, date, items])

  /* function to add new task to firestore */
  const handleSubmit = async (userEmail) => {
    setDeleting(true)
    try {
      await deleteDoc(doc(db, date.toString(), `${userEmail}`))
        .then(() => {
          console.log('Document successfully deleted!')
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
        })
    } catch (err) {
      alert(err)
    }
    setDeleting(false)
  }

  const bulkDelete = async () => {
    setDeleting(true)
    items.forEach((item) => {
      handleSubmit(item.email)
    })
    setDeleting(false)
  }
  function checkTime(i) {
    if (i < 100) {
      i = '0' + i
    } // add zero in front of numbers < 10
    if (i < 10) {
      i = '0' + i
    } // add zero in front of numbers < 10
    return i
  }

  return (
    <div className='center'>
      <div className='ticket-visual_visual h-520'>
        <div className='ticket-visual-wrapper py-30'>
          {items.length === 0 ? (
            <p>No Data</p>
          ) : (
            items.map((item, index) => {
              return (
                <div key={index}>
                  <br />
                  <div className='ticket-visual_ticket-number bold'>
                    #000{`${checkTime(index + 1)}`}
                  </div>
                  <div className='ticket-profile_profile'>
                    <img
                      width='100%'
                      src={item.data.photoURL ?? './card.png'}
                      alt='Card Illustration'
                      className='ticket-profile_image'
                    />
                    <br />
                    {currentUser?.email === 'ymakarim@gmail.com' && (
                      <button className='btn inline-block' onClick={() => handleSubmit(item.email)}>
                        {deleting ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                    <hr />
                  </div>
                </div>
              )
            })
          )}
          {currentUser?.email === 'ymakarim@gmail.com' && items.length > 0 && (
            <div className='fields'>
              <button className='btn' onClick={() => bulkDelete()}>
                {deleting ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default List
