import { useUser } from '../context/UserContext';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

type Props = {}

function UserPage2({ }: Props) {

    const { user } = useUser();
    const userProfileImage = user?.profile?.image || localStorage.getItem("profile_picture") || "/placeholders/placeholder-profile.png";
    const userBannerImage = "/placeholders/banner_placeholder.png";

    return (
        <div className="mx-auto w-full flex-grow lg:flex xl:px-8 h-full">
            <div className="m-4 lg:w-1/2 w-full h-max border-2 border-black rounded-lg p-2 shadow-lg shadow-slate-500 pb-4">
                {user ? (
                    <div >
                        <div style={{ position: 'relative' }}>
                            <img src={userBannerImage} alt="Banner" className='border-2 border-black rounded-md' />
                            <div style={{ position: 'absolute', bottom: 0, right: 0 }} className='p-4'>
                                <ArrowUpTrayIcon className='h-8 w-8 cursor-pointer text-yellow-400' />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 my-4">
                            <img src={userProfileImage} className="w-44 rounded-full border-2 border-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">{user.profile?.displayName ? user.profile?.displayName : localStorage.getItem("profileName")}</h1>
                            <p className="text-gray-600">{user.profile?.name}</p>
                            <p className="text-gray-700">{user.profile?.about}</p>
                            <p className="text-gray-700">{user.profile?.email}</p>
                            <p className="text-gray-700">Website: {user.profile?.website ? user.profile?.website : "No webite set - go to profile settings."}</p>
                            <p className="text-gray-700">{user.profile?.lud16}</p>
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            UserPage2
        </div>
    )
}

export default UserPage2