
import Link from 'next/link'

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post, index) => (
        <PostItem post={post} key={post.slug} admin={admin} />
    )) : null
}

function PostItem ({ post }) {
    const wordCount = post?.content.trim().split(/\s+/g).length
    const minutesToRead = (wordCount/ 100 +1).toFixed()

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <a>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>
            <Link href={`/${post.username}/${post.slug}`}>
                <a>
                    <strong>{' '}{post?.title}</strong>
                </a>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minutesToRead} min read {' '}
                </span>
                <span className="push-left"> {post.heartCount || 0} 💗</span>
            </footer>

        </div>
    )
}