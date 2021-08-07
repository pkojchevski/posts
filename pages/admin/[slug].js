import AuthCheck from "../../components/AuthCheck"
import Metatags from "../../components/Metatags"
import PostManager from '../../components/PostManager'

export default function AdminPostEdit({}) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    )
}