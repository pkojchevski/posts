
import { firestore, auth } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import PostFeed from './PostFeed'

const PostList = () => {
    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
    const query = postRef.orderBy('createdAt')
 
    const [querySnapshot] = useCollection(query)
 
    const posts = querySnapshot?.docs.map(doc => doc.data())
 
    return (
        <>
         <h1>Manage Your Posts</h1>
         <PostFeed posts={posts} admin />
 
        </>
    )
 
 }

 export default PostList