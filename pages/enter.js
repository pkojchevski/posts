
import {auth , googleAuthProvider} from '../lib/firebase'
import { useContext, useEffect, useState, useCallback } from 'react'
import { UserContext } from '../lib/context'
import { debounce } from 'lodash'
import { firestore } from '../lib/firebase'
import toast from 'react-hot-toast'
import Metatags from '../components/Metatags'


export default function EnterPage(props) {
    const { user, username } = useContext(UserContext)
  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
    return (
        <main>
            <Metatags title="Enter" description="Sign up for this amazing app!" />
            {user ? 
                !username ? <UsernameForm /> : <SignOutButton />
                :
                <SignInButton />
             }
        </main>
    )
}

// Sign in with google
function SignInButton() {
 const signInWithGoogle = async() => {
     try {
        await auth.signInWithPopup(googleAuthProvider)
     } catch (err) {
       console.log('err:', err.message)
       toast.error('Error!'+ err.message)
     }
   }
  
    return (
        <>
            <button className="btn-google"
            onClick={signInWithGoogle}
            >
                <img src={'/google_icon.png'} /> 
                Sign in with Google
            </button>
            <button onClick={() => auth.signInAnonymously()}>
                Sign in Anonymously
            </button>
        </>
    )
}

// sign out button 
function SignOutButton() {
    return (
        <button
           onClick={()=> auth.signOut()}>
               SignOut
        </button>
    )
}

function UsernameForm() {
   const [formValue, setFormValue] = useState('')
   const [isValid, setIsValid] = useState(false)
   const [loading, setLoading] = useState(false)

   const { user, username } = useContext(UserContext) 

   const onChange = e => {
       const val = e.target.value.toLowerCase()
       const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
       // Only set form value if length is < 3 OR it passes regex
       if(val.length < 3) {
        setFormValue(val)
        setLoading(false);
        setIsValid(false)
       } 
       if(re.test(val)) {
           setFormValue(val)
           setLoading(false)
           setIsValid(false)
       }
   }

   // hit the db for username match after each debounced change
   // useCallback is required for debounce to work(function to be memoizeds)
   const checkUsername = useCallback(
            debounce (async (username) => {
                if(username.length >= 3) {
                    const ref = firestore.doc(`usernames/${username}`)
                    const { exists } = await ref.get()
                    console.log('Firestore read executed!')
                    setIsValid(!exists)
                    setLoading(false)
                }
            }, 500),[]
        )
    const onSubmit = async e => {
        e.preventDefault()

        // create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`)
        const usernameDoc = firestore.doc(`usernames/${formValue}`)

        // Commit both together as batch write
        const batch = firestore.batch()
        batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName})
        batch.set(usernameDoc, { uid: user.uid })

        await batch.commit()
    }

    function UsernameMessage({ username, isValid, loading}) {
        if(loading) {
           return <p>Checking...</p>
        } else if (isValid) {
           return <p className="text-success">{username} is available</p>
        } else if(username && !isValid) {
            return <p className="text-danger">That username is taken</p>
        } else {
            return <p></p>
        }
    }

   useEffect(()=> {
       checkUsername(formValue)
   }, [formValue])

   return (
    !username && (
      <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
              <input name="username"
                placeholder="username"
                value={formValue}
                onChange={onChange}
               />
               <UsernameMessage username={formValue} isValis={isValid} loading={loading} />
            <button type="submit" className="btn-green" disabled={!isValid}>
                Choose
            </button>

            <h3>Debug state</h3>
            <div>
                Username: {formValue}
                <br />
                Loading: {loading.toString()}
                <br />
                Username valid: { isValid.toString()}
            </div>
          </form>
      </section>
    )
   )
}