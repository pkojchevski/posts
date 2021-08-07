import React, { useState } from 'react';
import { auth, STATE_CHANGED, storage } from '../lib/firebase';
import Loader from './Loader'

// Uploades images to firebase storage
const ImageUploader = () => {
    const [uploading, setUploading] = useState(false)
    const [progress, setprogress] = useState(0)
    const [downloadURL, setdownloadURL] = useState(null)

    const fileChangedHandler = (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
      }

    // Creates a Firebase Upload Task
    const fileUpload = async (e) => {
      const file = Array.from(e.target.files)[0]
      const extension = file.type.split('/')[1]

      // Makes reference to the storage bucket location
      const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
      setUploading(true)

      // Starts the upload
      const task = ref.put(file)

      // listen to update to upload task
      task.on(STATE_CHANGED, (snapshot) => {
          const pct = ((snapshot.butesTransferred / snapshot.totalBytes) * 100).toFixed(0)

          // Get downloadURL AFTER task resolves(not a native Promise)
          task.then(d => ref.getDownloadURL())
              .then(url => {
                  setdownloadURL(url)
                  setUploading(false)
                })
      })
    }
    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}
            {!uploading && (
                <>
                  <input type="file" id="imageInput" hidden="hidden" onChange={fileUpload} accept="image/x-png, image/gif, image/jpeg" style={{opacity:0 }}/>
                  <button onClick={fileChangedHandler}>Upload Image</button>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
            
        </div>
    );
}

export default ImageUploader;
