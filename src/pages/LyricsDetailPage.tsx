import React from 'react'
import LyricsView from '../components/LyricsView'
import CommentsList from '../components/CommentsList'

type Props = {}

function LyricsDetailPage({ }: Props) {
    return (
        <>
            <div className=" mx-auto w-full flex-grow lg:flex xl:px-8 ">
                <div className="lg:w-2/3 bg-blue-300 w-full">
                    <LyricsView />
                </div>
                <div className="lg:w-1/3 lg:h-screen bg-green-300 w-full">
                    <div className="m-auto">
                        <CommentsList />
                    </div>
                </div>
            </div>
        </>

    )
}

export default LyricsDetailPage