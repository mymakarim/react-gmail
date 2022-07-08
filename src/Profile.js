import { useAuthValue } from './AuthContext'
import { upload, db, deletePhoto } from './firebase'
import { useEffect, useState, useCallback } from 'react'
import {
  query,
  orderBy,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const navigate = useNavigate()
  const { currentUser } = useAuthValue()
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [queuenum, setQueuenum] = useState(null)
  const [total, setTotal] = useState(0)
  const [photoURL, setPhotoURL] = useState(null)

  const current = new Date()
  const date = `${current.getDate()}-${current.getMonth() + 1}-${current.getFullYear()}`

  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

  var colors = [
    '#fb8500',
    '#ffb703',
    '#ae2012',
    '#48cae4',
    '#0077b6',
    '#023e8a',
    '#03045e',
    '#f72585',
    '#b5179e',
    '#480ca8',
    '#0081a7',
    '#00afb9',
    '#7b2cbf',
    '#2b2d42',
    '#8d99ae',
    '#ef233c',
    '#5f0f40',
    '#ffd500',
    '#99582a',
    '#432818',
    '#9381ff',
    '#7371fc',
    '#9D34DA',
    '#DFE0E2',
    '#c9ada7',
    '#ddbdfc',
    '#662e9b',
    '#31263e',
    '#44355b',
    '#d62246',
    '#16697a',
    '#489fb5',
    '#6a994e',
    '#bc4749',
    '#0ead69',
    '#6f4518'
  ]

  const number_of_colors = colors.length // 36 in your example
  const number_of_days_per_year = 365 // for brevity of the example

  const day = current.getDate()

  // some 'lower school math' magic :)
  const index = Math.round((day * number_of_colors) / number_of_days_per_year)

  // the color of the day is .....
  // console.log('COLOR OF THE DAY: ', colors[index])

  function handleChange(e) {
    if (e.target.files[0] && e.target.files[0]['type'].split('/')[0] === 'image') {
      if (e.target.files[0].size / 1024 / 1024 < 1) {
        setPhoto(e.target.files[0])
      } else {
        alert('INVALID SIZE: Only less than 1 mb is accepted!')
      }
    } else {
      alert('INVALID FILE: Only images are accepted!')
      setPhoto(null)
    }
  }

  function handleClick() {
    // console.log('PHOTO: ', photo)
    // console.log('CURRENT USER: ', currentUser)
    // console.log('LOADING: ', loading)
    upload(photo, currentUser, setLoading, setPhotoURL)
  }

  const docs = []
  const admins = []
  const getQueue = async () => {
    console.log('GET QUEUE CALLED!!!!')
    const querySnapshot = await getDocs(query(collection(db, date.toString()), orderBy('created')))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data())
      docs.push({ id: doc.id, data: doc.data() })
    })
  }

  const getAdmins = async () => {
    const querySnapshot = await getDocs(collection(db, 'admins'))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data())
      admins.push(doc.id)
    })
  }
  // console.log('DOCS:', docs)

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser?.photoURL)
    }
  }, [currentUser])

  const getQueuethen = useCallback(() => {
    getQueue().then(() => {
      setTotal(docs.length)
      console.log('TOTAL: ', total)
      // docs.sort((a, b) => a.data.created - b.data.created)
      // console.log('SORTED: ', docs)
      const index = docs.findIndex((item) => item.id == currentUser?.email)
      // console.log('QUEUE NUM: ', queuenum)
      // console.log('INDEX: ', index)
      setQueuenum(index + 1)
      if (total >= 100 || docs.lenght >= 100) {
        if (index <= 0 && !admin) {
          // console.log('NO QUEUE NUMBER AND SET 100')
          navigate('/complete')
        }
      }
      console.log('NEW QUEU NUM: ', queuenum)
    })
  })

  getAdmins().then(() => {
    const index = admins.findIndex((item) => item === currentUser?.email)
    // console.log('admins: ', admins)
    // console.log('INDEX ADMIN: ', index)
    if (index !== -1) {
      setAdmin(true)
    }
    // console.log('NEW QUEU NUM: ', queuenum)
  })

  useEffect(() => {
    getQueuethen()
  }, [getQueue, getQueuethen])

  /* function to add new task to firestore */
  const handleSubmit = async () => {
    const docRef = doc(db, date.toString(), `${currentUser?.email}`)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      alert('SNAPSHOT EXISTS!!!')
    } else {
      if (!(queuenum === null || photoURL == null || total >= 100 || submitting)) {
        setSubmitting(true)
        try {
          await setDoc(doc(db, date.toString(), `${currentUser?.email}`), {
            photoURL: currentUser?.photoURL,
            created: Timestamp.now()
          }).then(() => {
            navigate('/counter')
            // setTimeout(function () {
            //   getQueuethen()
            //   setSubmitting(false)
            // }, 60000)
          })
        } catch (err) {
          alert(err)
        }
      }
    }
  }

  const imageToDefault = ({ currentTarget }) => {
    console.log('ON ERROR TRIGGERED')
    currentTarget.onerror = null // prevents looping
    deletePhoto(currentUser, setPhotoURL)
  }
  const toChars = (n) =>
    `${n >= 26 ? toChars(Math.floor(n / 26) - 1) : ''}${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[n % 26]}`

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
      <div className='ticket-visual_visual'>
        <div className='ticket-visual-wrapper py-30'>
          <div className='ticket-visual_ticket-number-wrapper'>
            <br />
            <div className='ticket-visual_ticket-number font-right'>Ticket</div>
            <p>{currentUser?.email}</p>
            <br />
          </div>
          <div className='ticket-visual_profile'>
            <div className='ticket-profile_profile'>
              {currentUser && (
                <>
                  {photoURL === null && (
                    <div className='fields'>
                      <input className='custom-file-input' type='file' onChange={handleChange} />
                      {photo && (
                        <button
                          className='btn-upload'
                          disabled={loading || !photo}
                          onClick={handleClick}
                        >
                          {loading ? 'Uploading...' : 'Upload'}
                        </button>
                      )}
                    </div>
                  )}
                  <img
                    width='100%'
                    src={photoURL ?? './card.png'}
                    onError={(currentTarget) => imageToDefault(currentTarget)}
                    alt='Card Illustration'
                    className='ticket-profile_image'
                  />
                </>
              )}
              <br />
              <div className='ticket-profile_text font-mplus'>
                {current.toLocaleDateString('en-US', options) + ' | '}
                <span className='meta' style={{ color: colors[index] }}>
                  {colors[index].substring(0, 3) +
                    toChars(current.getHours()) +
                    toChars(current.getDate()) +
                    toChars(current.getMonth())}
                </span>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className='ticket-visual_ticket-number-wrapper fields justify-center'>
            {queuenum > 0 && !submitting ? (
              <div className='ticket-visual_ticket-number bold'>#000{`${checkTime(queuenum)}`}</div>
            ) : (new Date().getHours() >= 15 && new Date().getHours() <= 16) || admin ? (
              submitting ? (
                <button className='btn' disabled={submitting}>
                  'Please wait 60 seconds ....'
                </button>
              ) : (
                <button
                  className='btn'
                  disabled={queuenum === null || photoURL == null || total >= 100}
                  onClick={() =>
                    queuenum === null || photoURL == null || total >= 100 || submitting
                      ? console.log('DISABLED')
                      : handleSubmit()
                  }
                >
                  {total >= 100
                    ? 'Bus 1 & 2 are full! Please get Bus 3'
                    : !photoURL
                    ? 'Please upload your STUDENT ID!'
                    : 'Get Queue Number'}
                </button>
              )
            ) : (
              <button className='btn' disabled='disabled'>
                {'Open from 3:30 to 4:30 PM'}
              </button>
            )}
          </div>
          <br />
          <div className='flex justify-center gap-2'>
            {false && (
              <Link className='link' to='/list'>
                <small className='link'>See List</small>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
