import { EyeIcon } from "@heroicons/react/20/solid" 
import { useNavigate } from "react-router-dom"

type Props = {
    username : string;
    loading: boolean;
}

function Welcome({username, loading}: Props) {

    const navigate = useNavigate();


  return (
    <div className="splash-card w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
            <div className='flex w-full justify-center mb-6'>
                <h1 className='font-extralight lg:text-5xl text-3xl text-center'>
                    Welcome back, <span className='italic font-light '>{username}</span>!
                </h1>
            </div>
            <div className='flex flex-col items-center space-y-3'>
                <div className='italic font-light text-gray-500 text-lg'>It's good to see you😍</div>
                <div className='italic font-light text-gray-500 text-lg'>This party can't start without you - the Artist 🪩</div>
                <div className='italic font-light text-gray-500 text-lg'>Please 😅 ⬇️</div>
                <form className='w-full p-4'>
                    <div className='items-start w-full flex flex-col mb-5'>
            
                        <div className='justify-center w-full my-6 flex'>
                            <button
                                onClick={()=>{navigate("/publish")}}
                                disabled={loading}
                                className="hover:shadow-xl transition duration-300 ease-in-out hover:scale-105 flex items-center h-10 border-black border-2  text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm lg:text-base xl:text-lg px-4 lg:px-5 xl:px-6 py-2.5 lg:py-3 xl:py-3.5 text-center mx-2"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <span className="animate-spin inline-block mr-2">
                                            <svg
                                                className="w-5 h-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                        </span>
                                        Loading...
                                    </div>
                                ) : (
                                    <>
                                       📝 Publish Your Lyrics
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
  )
}

export default Welcome