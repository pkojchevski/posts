import styles from '../styles/Admin.module.css';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, auth } from '../lib/firebase'
import PostForm from './PostForm'
import Link from 'next/link'
import DeletePostButton from './DeletePostButton';

const PostManager = () => {
    const [preview, setPreview] = useState(false)

    const router = useRouter()
    const { slug } = router.query
    const postRef = firestore.collection('users').doc(auth.currentUser.uid)
        .collection('posts').doc(slug)
    
    const [post] = useDocumentData(postRef)

    return (
      <main className={styles.container}>
        {post && (
            <>
                <section>
                    <p>{post?.title}</p>
                    <p>ID: {post?.slug}</p>
                    <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                </section>
                <aside>
                    <h3>Tools</h3>
                    <button onClick={()=> setPreview(!preview)}>
                        {preview ? 'Edit' : 'Preview'}
                    </button>
                    <Link href={`/${post.username}/${post.slug}`}>
                      <button className="btn-blue">Live view</button>
                    </Link>
                    <DeletePostButton postRef={postRef} />
                </aside>
            </>
        )}
      </main>
    );
}

export default PostManager


