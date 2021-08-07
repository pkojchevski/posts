import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBeed5n9An02KRV3JLSi6D9PIUGcFu8gRc",
    authDomain: "blog-ab8da.firebaseapp.com",
    projectId: "blog-ab8da",
    storageBucket: "blog-ab8da.appspot.com",
    messagingSenderId: "1082349201885",
    appId: "1:1082349201885:web:27dedf207a084b8370ee34",
    measurementId: "G-B8HXWB9WTQ"
  };

  if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
  }

  export const auth = firebase.auth();
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

  export const firestore = firebase.firestore()
  export const storage = firebase.storage()
  export const fromMillis = firebase.firestore.Timestamp.fromMillis;
  export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
  export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
  export const increment = firebase.firestore.FieldValue.increment

  
  /// Helper function
  /**
   * Gets a users/{uid} document with username
   * @param {string} username
   */

  export async function getUserWithUsername(username) {
      const usersRef = firestore.collection('users')
      const query = usersRef.where('username', '==', username).limit(1)
      const userDoc = (await query.get()).docs[0]
      console.log('userDoc:', userDoc)
      return userDoc
  }

  /**
   * Converts a firestore document to JSON
   * @param {DocumentSnapshot} doc
   */
  export function postToJSON(doc) {
      const data = doc.data()
      
      return {
          ...data,
          // Firestore timestamp NOT serializable to JSON. Must be converted to miliseconds
          createdAt: data?.createdAt.toMillis() || 0,
          updatedAt: data?.updatedAt.toMillis() || 0
      }
  }

