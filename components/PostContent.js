
import Link from 'next/link'
import ReactMarkDown from 'react-markdown'
import dayjs from 'dayjs'

export default function PostContent({ post }) {
    console.log('post:', post)
    const createdAt = typeof post?.createdAt === 'number' ?
          new Date(post?.createdAt) : post?.createdAt.toDate()

    return (
        <div className="card">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by {''}
                <Link rel="stylesheet" href={`/${post?.username}/`}>
                    <a className="text-info">@{post?.username}</a>
                </Link>
                 {' '} written {dayjs().diff(dayjs(createdAt),'days') === 0 ? 'today' : dayjs().diff(dayjs(createdAt),'days') + 'days ago'}
            </span>
            <ReactMarkDown>{post?.content}</ReactMarkDown>
        </div>
    )



}