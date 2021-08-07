import { useRouter } from "next/dist/client/router";
import { UserContext } from "../lib/context";
import kebabCase from "lodash.kebabcase";
import styles from '../styles/Admin.module.css';
import toast from "react-hot-toast";
import { useContext, useState } from 'react'
import { auth, firestore, serverTimestamp } from '../lib/firebase'

const CreateNewPost = () => {
    const router = useRouter()
 
    const { username } = useContext(UserContext)
    const [title, setTitle] = useState("")
 
    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title))
    
 
    // Validate length 
    const isValid = title.length > 3 && title.length < 100
 
 
    const createPost = async (e) => {
      e.preventDefault()
 
      const uid = auth.currentUser.uid;
      const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)
 
      // Give all fields a default value here
      const data = {
          title, slug, uid,
          username, 
          published: false,
          content: '# You new post',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          heartCount: 0
      }
 
      await ref.set(data)
 
      toast.success("Post created")
 
      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`)
    }
 
    return (
 
     <form onSubmit={createPost}>
       <input
         value={title}
         onChange={(e) => setTitle(e.target.value) }
         placeholder="My article"
         className={styles.input}
        />
        <p>
            <strong>Slug:</strong> {slug}
        </p>
        <button className="btn-green" type="submit" disabled={!isValid} >
            Create New Post
        </button>
     </form>
 
    )
 }

 export default CreateNewPost