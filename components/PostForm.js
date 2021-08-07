import styles from '../styles/Admin.module.css';

import React from 'react';
import { useForm } from 'react-hook-form';
import { serverTimestamp } from '../lib/firebase'
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import ImageUploader from './ImageUploader'

const PostForm = ({ defaultValues, postRef, preview}) => {
    const { register, handleSubmit, reset, watch, formState, errors } = useForm({defaultValues, mode:'onChange'})
    const { isValid, isDirty } = formState;
    console.log('defaultValue:', defaultValues)
    const updatePost = async({content, published}) => {
        console.log(content, published)
        await postRef.update({
            content,
            published,
            updatedAt: serverTimestamp()
        })
        reset({content, published})
        toast.success('Post updated successfully')
    }


    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}
            <div className={preview ? styles.hidden : styles.controls }>
                <ImageUploader />

                <textarea name="content" 
                       {...register('content', {
                        maxLength:20000, required:true, minLength: 10
                       })}
                ></textarea>
                {/* {
                errors.content && 
                <p className="text-danger">
                    {errors.content.message}
                </p>
                } */}
                <fieldset>
                    <input type="checkbox" className={styles.checkbox} name="published" {...register('published')} />
                    <label htmlFor="">Published</label>
                </fieldset>
                <button className="btn-green" type="submit" disabled={!isValid || !isDirty}>
                    Save Changes
                </button>
            </div>

        </form>
    );
}

export default PostForm;
