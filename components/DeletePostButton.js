import { useRouter } from 'next/dist/client/router';
import toast from 'react-hot-toast';

const DeletePostButton = ({ postRef }) => {
    const router = useRouter();
  
    const deletePost = async () => {
      const doIt = confirm('are you sure!');
      if (doIt) {
        await postRef.delete();
        router.push('/admin');
        toast('post annihilated ', { icon: '🗑️' });
      }
    };
  
    return (
      <button className="btn-red" onClick={deletePost}>
        Delete
      </button>
    );
  }

  export default DeletePostButton