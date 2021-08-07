import AuthCheck from "../../components/AuthCheck";
import PostList from "../../components/PostList";
import CreateNewPost from "../../components/CreateNewPost";


export default function AdminPostPage(props) {
    return (
        <main>
           <AuthCheck>
              <PostList />
              <CreateNewPost />
           </AuthCheck>
        </main>
    )

}


