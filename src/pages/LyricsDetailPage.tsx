import CommentsList from '../components/CommentsList'
import LyricsView from '../components/LyricsView'

type Props = {}

function LyricsDetailPage({ }: Props) {
    return (
        <>
            <div className=" mx-auto w-full flex-grow lg:flex xl:px-8 ">
                <div className="lg:w-2/3 w-full">
                    <LyricsView />
                </div>
                <div className="lg:w-1/3 lg:h-screen bg-white shadow-2xl rounded-lg w-full ml-2">
                    <div className="m-auto">
                        <CommentsList />
                    </div>
                </div>
            </div>
        </>

    )
}

export default LyricsDetailPage