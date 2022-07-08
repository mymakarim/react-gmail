import { initializeApp } from 'firebase/app'
import { getAuth, updateProfile } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAmsIVYYFOnDeOZQnYdD7l95y4JGjbnfXw',
  authDomain: 'fir-user-auth-ec3e4.firebaseapp.com',
  projectId: 'fir-user-auth-ec3e4',
  storageBucket: 'fir-user-auth-ec3e4.appspot.com',
  messagingSenderId: '93243186143',
  appId: '1:93243186143:web:ec711c0764d97ebb16c26a'
}

// Initialize Firebase and Firebase Authentication
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage()
const db = getFirestore(app)

// Storage
async function upload(file, currentUser, setLoading, setPhotoURL) {
  const fileRef = ref(storage, currentUser.uid + '.' + file.name.split('.')[1])
  setLoading(true)
  await uploadBytes(fileRef, file)
  const photoURL = await getDownloadURL(fileRef)
  updateProfile(currentUser, { photoURL })
  setPhotoURL(photoURL)
  setLoading(false)
  // alert(fileRef)
}

function deletePhoto(currentUser, setPhotoURL) {
  updateProfile(currentUser, { photoURL: '' }).then(() => {
    // alert('photoURL deleted!')
    setPhotoURL(null)
  })
}

export { auth, db, upload, deletePhoto }
