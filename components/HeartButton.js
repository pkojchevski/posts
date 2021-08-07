import { useDocumentData } from 'react-firebase-hooks/firestore';
import React from 'react';
import { auth, firestore, increment } from '../lib/firebase';


// allows user to heart or like the post
const HeartButton = ({ postRef }) => {
    // listen to heart document for currently logged in user
    const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid)
    const [heartDoc] = useDocumentData(heartRef)

    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = firestore.batch()
        
        batch.update(postRef, {heartCount: increment(1)})
        batch.set(heartRef, { uid });
        await batch.commit()   

    }


    const removeHeart = async () => {
        // const uid = auth.currentUser.uid;
        const batch = firestore.batch()

        batch.update(postRef, {heartCount: increment(-1)})
        batch.delete(heartRef)

        await batch.commit()
    }

    return heartDoc?.exists ? (
         <button onClick={removeHeart}>💔</button>
       ) : (
        <button onClick={addHeart}>❤️</button>
       )
    
}

export default HeartButton;



